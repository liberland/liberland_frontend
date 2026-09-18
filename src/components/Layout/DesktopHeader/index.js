/* eslint-disable max-len */
import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'antd/es/dropdown';
import { AuthContext } from 'react-oauth2-code-pkce';
import { userSelectors } from '../../../redux/selectors';
import { authActions } from '../../../redux/actions';
import ChangeWallet from '../../Home/ChangeWallet';
import UserMenu from '../../UserMenu';
import router from '../../../router';
import { getNetworkConfig } from '../../../utils/networkHelpers';
import { getPageTitle } from '../../../utils/pageTitle';
import { useNavigationList } from '../hooks';
import { NetworkSwitcher, ThemeToggle } from '../HeaderControls';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

function DesktopHeader() {
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { logOut } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);
  const givenName = useSelector(userSelectors.selectUserGivenName);
  const familyName = useSelector(userSelectors.selectUserFamilyName);

  const [title, sub] = getPageTitle(pathname);

  // Per-route primary action declared in navigationList (`extra`). The old
  // Layout rendered these through PageTitle, which the redesign dropped —
  // taking "Register a new company" with it and leaving no route to company
  // registration anywhere in the UI.
  const { matchedRoute, matchedSubLink } = useNavigationList();
  const pageAction = Object.entries((matchedSubLink || matchedRoute)?.extra || {})
    .find(([path]) => path === pathname)?.[1];

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
        {pageAction && (
          <Button
            primary
            onClick={() => history.push(pageAction.link)}
            data-testid="page-action"
          >
            {pageAction.title}
          </Button>
        )}
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
