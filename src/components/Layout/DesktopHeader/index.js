/* eslint-disable max-len */
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
import {
  NETWORKS, getSelectedNetwork, setSelectedNetwork, getNetworkConfig,
} from '../../../utils/networkHelpers';
import { getPageTitle } from '../../../utils/pageTitle';
import styles from './styles.module.scss';

function NetworkSwitcher() {
  const current = getSelectedNetwork();
  const dotClass = current === 'testnet'
    ? `${styles.networkDot} ${styles.networkDotTestnet}`
    : styles.networkDot;
  const items = Object.values(NETWORKS).map((n) => ({
    key: n.key,
    label: n.label,
  }));
  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [current],
        onClick: ({ key }) => { if (key !== current) setSelectedNetwork(key); },
      }}
      trigger={['click']}
    >
      <button
        type="button"
        className={`${styles.networkBadge} ${styles.networkBadgeBtn}`}
        aria-haspopup="menu"
        aria-label={`Network: ${NETWORKS[current].label}. Change network`}
        data-testid="network-switcher"
        data-network={current}
      >
        <span className={dotClass} />
        {NETWORKS[current].label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </Dropdown>
  );
}

function ThemeToggle() {
  const { isDarkMode, setIsDarkMode } = useModeContext();
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setIsDarkMode(!isDarkMode)}
      data-testid="theme-toggle"
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

  // eslint-disable-next-line no-nested-ternary
  const initials = givenName && familyName
    ? `${givenName[0]}${familyName[0]}`.toUpperCase()
    : (givenName ? givenName.slice(0, 2).toUpperCase() : null);

  const displayName = givenName
    ? `${givenName}${familyName ? ` ${familyName}` : ''}`
    : null;

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    // Resolve SSO from the live network selection (not build-time env), so
    // logout hits the same SSO that login used after a network switch.
    const { ssoApi, frontendRedirect } = getNetworkConfig();
    window.location.href = `${ssoApi}/logout?redirect=${frontendRedirect}`;
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
        <NetworkSwitcher />
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
            <button
              type="button"
              className={styles.userBtn}
              aria-haspopup="menu"
              aria-label={`Account menu for ${displayName}`}
              data-testid="user-menu"
            >
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
