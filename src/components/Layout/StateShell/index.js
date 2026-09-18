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
import liberlandEmblem from '../../../assets/images/liberland-blockchain-logo.png';
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

// The mockup's domain grouping, mapped onto the application's real routes.
const NAV_GROUPS = [
  {
    label: 'Treasury',
    items: [
      { key: 'wallet', label: 'Wallet', route: router.wallet.overView },
      { key: 'exchange', label: 'Exchange', route: router.wallet.exchange },
      { key: 'staking', label: 'Staking', route: router.staking.overview },
      { key: 'bridge', label: 'Bridge', route: router.wallet.bridge },
    ],
  },
  {
    label: 'Assembly',
    items: [
      { key: 'congress', label: 'Congress & Senate', route: router.congress.overview },
      { key: 'voting', label: 'Voting', route: router.voting.referendum },
      { key: 'legislation', label: 'Legislation', route: router.legislation.constitution },
    ],
  },
  {
    label: 'Registry',
    items: [
      { key: 'companies', label: 'Company register', route: router.companies.allCompanies },
      { key: 'land', label: 'Land', route: router.registries.land },
      { key: 'assets', label: 'Assets', route: router.registries.assets },
      { key: 'identity', label: 'Identity', route: router.home.profile },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'feed', label: 'Dashboard', route: router.home.feed },
      { key: 'documents', label: 'Documents', route: router.documents.myAccount },
      { key: 'contracts', label: 'Contracts', route: router.contracts.overview },
    ],
  },
];

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

  const isActive = (item) => (item.key === 'feed'
    ? pathname === router.home.feed || pathname === router.home.index
    : pathname.startsWith(item.route.split('/').slice(0, 3).join('/')));

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

      <header className={styles.statusBar}>
        <div className={styles.brand}>
          <img src={liberlandEmblem} alt="" className={styles.emblem} />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Liberland</span>
            <span className={styles.brandSub}>State Blockchain</span>
          </span>
        </div>

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
                  <span className={styles.groupRule} aria-hidden="true" />
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
