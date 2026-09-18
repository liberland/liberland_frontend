/* eslint-disable max-len */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'antd/es/dropdown';
import { AuthContext } from 'react-oauth2-code-pkce';
import { blockchainSelectors, userSelectors } from '../../../redux/selectors';
import { authActions } from '../../../redux/actions';
import router from '../../../router';
import { getNetworkConfig } from '../../../utils/networkHelpers';
import { NetworkSwitcher, ThemeToggle } from '../HeaderControls';
import ChangeWallet from '../../Home/ChangeWallet';
import UserMenu from '../../UserMenu';
import Button from '../../Button/Button';
import { useNavigationList } from '../hooks';
import Emblem from '../../Emblem';
import StatePageHeader from './StatePageHeader';
import { getPageTitle } from '../../../utils/pageTitle';
import styles from './styles.module.scss';

/*
 * The Liberland State shell.
 *
 * Reproduces the State design language's chrome: a status bar carrying the
 * finalized block height, and a sidebar grouped by domain rather than the
 * Ledger's flat sections. Rendered instead of the Ledger chrome when that
 * language is selected; the page content inside is identical in both.
 *
 * Every automation and accessibility hook the Ledger shell exposes is
 * reproduced here — nav testids, the labelled navigation landmark, the page
 * action, and main#main-content — so tooling works the same in either
 * language.
 */

/*
 * The design language's domain grouping, mapped onto the application's real
 * routes.
 *
 * `route` is where the entry navigates. `owns` lists the route prefixes the
 * entry stands for when nothing matches exactly — several entries live under
 * one section (Wallet, Exchange and Bridge are all under /home/wallet), so the
 * section alone cannot say which is current, and a sibling screen such as the
 * faucet has no entry of its own but still belongs to the Wallet.
 */
const NAV_GROUPS = [
  {
    label: 'Treasury',
    items: [
      {
        key: 'wallet', label: 'Wallet', route: router.wallet.overView, owns: [router.home.wallet],
      },
      { key: 'exchange', label: 'Exchange', route: router.wallet.exchange },
      {
        key: 'staking', label: 'Staking', route: router.staking.overview, owns: [router.home.staking],
      },
      { key: 'bridge', label: 'Bridge', route: router.wallet.bridge },
    ],
  },
  {
    label: 'Assembly',
    items: [
      {
        key: 'congress',
        label: 'Congress & Senate',
        route: router.congress.overview,
        owns: [router.home.congress, router.home.senate, router.home.offices],
      },
      {
        key: 'voting', label: 'Voting', route: router.voting.referendum, owns: [router.home.voting],
      },
      {
        key: 'legislation',
        label: 'Legislation',
        route: router.legislation.constitution,
        owns: [router.home.legislation],
      },
    ],
  },
  {
    label: 'Registry',
    items: [
      {
        key: 'companies',
        label: 'Company register',
        route: router.companies.allCompanies,
        owns: [router.home.companies],
      },
      {
        key: 'land', label: 'Land', route: router.registries.land, owns: [router.home.registries],
      },
      { key: 'assets', label: 'Assets', route: router.registries.assets },
      {
        key: 'identity', label: 'Identity', route: router.home.profile, owns: [router.home.profile],
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        key: 'feed', label: 'Dashboard', route: router.home.feed, owns: [router.home.feed],
      },
      {
        key: 'documents', label: 'Documents', route: router.documents.myAccount, owns: [router.home.documents],
      },
      {
        key: 'contracts', label: 'Contracts', route: router.contracts.overview, owns: [router.home.contracts],
      },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items.map((item) => ({ ...item, group: g.label })));

const covers = (prefix, pathname) => pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * The single nav entry the current route belongs to.
 *
 * The longest matching `route` wins, so /home/wallet/bridge selects Bridge
 * rather than Wallet; only if no entry's own route matches does an `owns`
 * prefix decide. Returning one entry rather than a predicate per entry is what
 * stops sibling routes lighting up three items at once.
 */
const resolveCurrent = (pathname) => {
  if (pathname === router.home.index) return ALL_ITEMS.find((item) => item.key === 'feed');
  const exact = ALL_ITEMS
    .filter((item) => covers(item.route, pathname))
    .sort((a, b) => b.route.length - a.route.length)[0];
  if (exact) return exact;
  return ALL_ITEMS.find((item) => (item.owns || []).some((prefix) => covers(prefix, pathname)));
};

const LEDES = {
  legislation: 'Every tier below is held on chain and carries legal force. Sections are addressed by tier, index and hash.',
};

function StateShell({ children }) {
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { logOut } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);
  const givenName = useSelector(userSelectors.selectUserGivenName);
  const familyName = useSelector(userSelectors.selectUserFamilyName);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);

  const { matchedRoute, matchedSubLink } = useNavigationList();
  const pageAction = Object.entries((matchedSubLink || matchedRoute)?.extra || {})
    .find(([path]) => path === pathname)?.[1];

  const displayName = givenName ? `${givenName}${familyName ? ` ${familyName}` : ''}` : null;
  // eslint-disable-next-line no-nested-ternary
  const initials = givenName && familyName
    ? `${givenName[0]}${familyName[0]}`.toUpperCase()
    : (givenName ? givenName.slice(0, 2).toUpperCase() : null);

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    const { ssoApi, frontendRedirect } = getNetworkConfig();
    window.location.href = `${ssoApi}/logout?redirect=${frontendRedirect}`;
  };

  // Derive the screen's eyebrow and title from the same entry the sidebar
  // highlights, so every route is framed — including the ones the design
  // language never drew. The dashboard supplies its own headline, so the shell
  // stays out of its way.
  const current = resolveCurrent(pathname);
  // An entry reached through `owns` covers the screen but does not name it —
  // /home/offices/finances belongs under the assembly without being Congress —
  // so the heading falls back to the route's own title and keeps the domain.
  const named = current && covers(current.route, pathname);
  const isDashboard = pathname === router.home.feed || pathname === router.home.index;
  const headerTitle = named ? current.label : getPageTitle(pathname)[0];
  const headerEyebrow = current ? current.group : undefined;

  const isActive = (item) => current?.key === item.key;

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

      <header className={styles.statusBar}>
        <div className={styles.brand}>
          <Emblem height={30} className={styles.emblem} alt="" />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Liberland</span>
            <span className={styles.brandSub}>State Blockchain</span>
          </span>
        </div>

        <span className={styles.brandRule} aria-hidden="true" />

        <div className={styles.chain} data-testid="state-block-height">
          <span className={styles.chainDot} aria-hidden="true" />
          <span className={styles.chainLabel}>Finalized</span>
          <span className={styles.chainNumber}>
            {blockNumber != null ? `#${Number(blockNumber).toLocaleString()}` : '—'}
          </span>
        </div>

        <div className={styles.statusActions}>
          {pageAction && (
            <Button primary onClick={() => history.push(pageAction.link)} data-testid="page-action">
              {pageAction.title}
            </Button>
          )}
          <ThemeToggle />
          <NetworkSwitcher />
          <ChangeWallet />
          {user && displayName ? (
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: 'View Profile' },
                  { key: 'logout', label: 'Logout', danger: true },
                ],
                onClick: ({ key }) => {
                  if (key === 'profile') history.push(router.home.profile);
                  if (key === 'logout') handleLogout();
                },
              }}
              trigger={['click']}
            >
              <button
                type="button"
                className={styles.userChip}
                aria-haspopup="menu"
                aria-label={`Account menu for ${displayName}`}
                data-testid="user-menu"
              >
                <span className={styles.avatar}>{initials}</span>
                <span className={styles.userName}>{displayName}</span>
              </button>
            </Dropdown>
          ) : <UserMenu />}
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sider}>
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className={styles.group}>
                <div className={styles.groupLabel}>
                  <span
                    className={`${styles.groupRule} ${styles[`groupRule${group.label}`] || ''}`}
                    aria-hidden="true"
                  />
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`${styles.navItem} ${isActive(item) ? styles.navItemActive : ''}`}
                    onClick={() => history.push(item.route)}
                    aria-current={isActive(item) ? 'page' : undefined}
                    data-testid={`nav-${item.key}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className={styles.motto}>To live and let live</div>
        </aside>

        <main id="main-content" className={styles.content}>
          {!isDashboard && (
            <StatePageHeader
              eyebrow={headerEyebrow}
              title={headerTitle}
              lede={named ? LEDES[current.key] : undefined}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

StateShell.propTypes = {
  children: PropTypes.node,
};

export default StateShell;
