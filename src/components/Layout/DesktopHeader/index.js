import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'antd/es/dropdown';
import { AuthContext } from 'react-oauth2-code-pkce';
import { userSelectors } from '../../../redux/selectors';
import { authActions } from '../../../redux/actions';
import { useModeContext } from '../../AntdProvider';
import ChangeWallet from '../../Home/ChangeWallet';
import UserMenu from '../../UserMenu';
import router from '../../../router';
import styles from './styles.module.scss';

const PAGE_TITLES = [
  { test: (p) => p === router.home.feed || p === router.home.index, title: 'Dashboard', sub: 'Welcome back to the Republic' },
  { test: (p) => p.startsWith(router.home.wallet), title: 'Wallet', sub: 'Your assets, staking & transfers' },
  { test: (p) => p.startsWith(router.home.documents), title: 'Identity & Documents', sub: 'Your citizenship, records & court standing' },
  { test: (p) => p.startsWith(router.voting.referendum), title: 'Voting', sub: 'Referenda, proposals & the assembly' },
  { test: (p) => p.startsWith(router.voting.congressionalAssemble), title: 'Congress Assembly', sub: 'Congressional votes & governance' },
  { test: (p) => p.startsWith(router.home.legislation), title: 'Legislation', sub: 'The Constitution and the law of the land' },
  { test: (p) => p.startsWith(router.home.congress), title: 'Congress', sub: 'Motions, members & the congressional treasury' },
  { test: (p) => p.startsWith(router.home.senate), title: 'Senate', sub: 'Veto motions & scheduled spending' },
  { test: (p) => p.startsWith(router.home.staking), title: 'Staking', sub: 'Secure the chain, earn rewards' },
  { test: (p) => p.startsWith(router.home.registries), title: 'Registries', sub: 'Companies, land & on-chain assets' },
  { test: (p) => p.startsWith(router.contracts.overview) || p.startsWith(router.home.contracts), title: 'Contracts', sub: 'Agreements signed on-chain' },
  { test: (p) => p.startsWith(router.home.offices), title: 'Offices', sub: 'Government offices & state services' },
  { test: (p) => p.startsWith(router.home.companies), title: 'Companies', sub: 'Business registry of Liberland' },
  { test: (p) => p.startsWith(router.nfts.overview) || p.startsWith(router.home.nfts), title: 'NFTs', sub: 'Digital assets & collectibles' },
  { test: (p) => p.startsWith(router.home.profile), title: 'Profile', sub: 'Your account & settings' },
];

function getPageTitle(pathname) {
  const match = PAGE_TITLES.find((entry) => entry.test(pathname));
  return match ? [match.title, match.sub] : ['Liberland', 'Republic Ledger'];
}

function ThemeToggle() {
  const { isDarkMode, setIsDarkMode } = useModeContext();
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      {isDarkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function DesktopHeader() {
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { logOut } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);
  const givenName = useSelector(userSelectors.selectUserGivenName);
  const familyName = useSelector(userSelectors.selectUserFamilyName);

  const [title, sub] = getPageTitle(pathname);

  const initials = givenName && familyName
    ? `${givenName[0]}${familyName[0]}`.toUpperCase()
    : (givenName ? givenName.slice(0, 2).toUpperCase() : null);

  const displayName = givenName
    ? `${givenName}${familyName ? ` ${familyName}` : ''}`
    : null;

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    window.location.href = `${process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
  };

  const userDropdownItems = [
    { key: 'profile', label: 'View Profile' },
    { key: 'logout', label: 'Logout', danger: true },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageSub}>{sub}</p>
      </div>
      <div className={styles.actions}>
        <ThemeToggle />
        <div className={styles.networkBadge}>
          <span className={styles.networkDot} />
          Mainnet
        </div>
        <ChangeWallet />
        {user && displayName ? (
          <Dropdown
            menu={{
              items: userDropdownItems,
              onClick: ({ key }) => {
                if (key === 'profile') history.push(router.home.profile);
                if (key === 'logout') handleLogout();
              },
            }}
            trigger={['click']}
          >
            <button type="button" className={styles.userBtn}>
              <span className={styles.avatar}>{initials}</span>
              <span className={styles.userInfo}>
                <span className={styles.userName}>{displayName}</span>
                <span className={styles.citizenBadge}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1.5 14.6 7l6 .6-4.5 4 1.3 5.9L12 14.6 6.6 17.5 7.9 11.6l-4.5-4 6-.6z" />
                  </svg>
                  CITIZEN
                </span>
              </span>
            </button>
          </Dropdown>
        ) : (
          <UserMenu />
        )}
      </div>
    </header>
  );
}

export default DesktopHeader;
