import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { useMediaQuery } from 'usehooks-ts';

// COMPONENTS
import { AuthContext } from 'react-oauth2-code-pkce';
import NavigationLink from '../NavigationLink';
import RoleHOC from '../../../hocs/RoleHOC';
import Header from '../../AuthComponents/Header';
import GetCitizenshipCard from '../Cards/GetCitizenshipCard';
import ChangeWallet from '../ChangeWallet';
import router from '../../../router';

// ASSETS
import styles from './styles.module.scss';
import DocumentsIcon from '../../../assets/icons/documents.svg';

import OpenMenuIcon from '../../../assets/icons/menu.svg';
import CloseMenuIcon from '../../../assets/icons/close.svg';

// REDUX
import {
  userSelectors,
  walletSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
// CONSTANTS
// import roleEnums from '../../../constants/roleEnums';

// UTILS
import { formatMerits } from '../../../utils/walletHelpers';
import {
  authActions, walletActions, blockchainActions, validatorActions,
} from '../../../redux/actions';
import LogoutModal from '../../Modals/LogoutModal';
import Button from '../../Button/Button';
import { navigationList } from '../../../constants/navigationList';

function HomeNavigation() {
  const { logOut, login } = useContext(AuthContext);
  const location = useLocation();
  const user = useSelector(userSelectors.selectUser);
  const roles = useSelector(userSelectors.selectUserRole);
  const name = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const totalBalance = useSelector(walletSelectors.selectorTotalLLM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isMedium = useMediaQuery('(min-width: 48em)');
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const homeTitle = name && lastName ? `${name} ${lastName}` : 'PROFILE';
  const fullName = name && lastName ? `${name} ${lastName}` : undefined;
  const [isLogoutModalOpen, setLogoutIsModalOpen] = useState(false);
  const isWalletAdressSame = useSelector(
    blockchainSelectors.isUserWalletAddressSameAsUserAdress,
  );

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch, walletAddress]);

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    window.location.href = `
    ${process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const switchToRegisteredWallet = (isMobile = false) => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const homeIcon = {
    route: router.home.profile,
    title: homeTitle,
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    // eslint-disable-next-line react/no-unstable-nested-components
    icon: () => (
      <Avatar
        name={fullName}
        color="#FDF4E0"
        fgColor="#F1C823"
        round
        size="41px"
      />
    ),
    description: `${formatMerits(totalBalance)} LLM`,
    isDiscouraged: false,
  };

  const navigation = [
    homeIcon,
    ...navigationList,
  ];

  const desktopNavbar = (
    <div className={`${styles.navigationWrapper}`}>
      <div className={styles.navigationContent}>
        <div className={styles.logoHeaderWrapper}>
          <Header />
        </div>
        {roles
          && navigation.map(
            ({
              route,
              icon,
              title,
              access,
              description,
              isDiscouraged,
            }) => (
              <RoleHOC key={route} roles={roles} access={access}>
                <NavigationLink
                  route={route}
                  title={title}
                  icon={icon}
                  path={location.pathname}
                  description={description}
                  isDiscouraged={isDiscouraged}
                />
              </RoleHOC>
            ),
          )}
        {user ? (
          <div onClick={() => setLogoutIsModalOpen(true)}>
            <NavigationLink
              route="logout"
              title="LOGOUT"
              icon={DocumentsIcon}
              path="logout"
            />
          </div>
        )
          : (
            <div onClick={() => login()}>
              <NavigationLink
                route="sigin"
                title="SIGNIN"
                icon={DocumentsIcon}
                path="sigin"
              />
            </div>
          )}

        {user
          && !isWalletAdressSame
          && (
            <div className={styles.buttonSwtichWalletWrapper}>
              <Button
                className={styles.buttonSwtichWallet}
                secondary
                onClick={() => switchToRegisteredWallet(true)}
              >
                Switch to registered wallet
              </Button>
            </div>
          )}

        <ChangeWallet />
        {roles?.['e-resident'] === 'e-resident' ? <GetCitizenshipCard /> : ''}
        {isLogoutModalOpen && (
          <LogoutModal
            handleLogout={handleLogout}
            closeModal={() => setLogoutIsModalOpen(false)}
          />
        )}
        {/* roles.citizen === 'citizen' ? <NextAssemblyCard /> : '' */}
      </div>
    </div>
  );

  const mobileNavbar = (
    <div>
      <div
        className={`${styles.mobileNavigationWrapper} ${
          isMenuOpen && styles.mobileNavigationWrapperOpen
        }`}
      >
        <div
          className={styles.navbarNavigationWrapper}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={styles.logoHeaderWrapper}>
            <Header />
          </div>
          <div>
            <img
              className={styles.navbarNavigationIcon}
              src={isMenuOpen ? CloseMenuIcon : OpenMenuIcon}
              alt={isMenuOpen ? 'Close menu icon' : 'Open menu icon'}
            />
          </div>
        </div>
        <div className={styles.navigationContent}>
          {navigation.map(
            (
              {
                route,
                icon,
                title,
                access,
                description,
                isDiscouraged,
              },
              index,
            ) => (
              <React.Fragment key={route}>
                <div key={route} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <RoleHOC roles={roles} access={access}>
                    <NavigationLink
                      route={route}
                      title={title}
                      icon={icon}
                      path={location.pathname}
                      description={description}
                      isDiscouraged={isDiscouraged === 'true'}
                    />
                  </RoleHOC>
                </div>
                {index === 0
                  && (
                  <>
                    <ChangeWallet setIsMenuOpen={setIsMenuOpen} />
                    { !isWalletAdressSame && !!walletAddress && (
                    <div className={styles.buttonSwtichWalletWrapper}>
                      <Button
                        className={styles.buttonSwtichWallet}
                        secondary
                        onClick={() => switchToRegisteredWallet(true)}
                      >
                        Switch to registered wallet
                      </Button>

                    </div>
                    )}
                  </>
                  )}
              </React.Fragment>
            ),
          )}
          {user ? (
            <div onClick={() => {
              setLogoutIsModalOpen(true);
              setIsMenuOpen(false);
            }}
            >
              <NavigationLink
                route="logout"
                title="LOGOUT"
                icon={DocumentsIcon}
                path="logout"
              />
            </div>
          )
            : (
              <div onClick={() => login()}>
                <NavigationLink
                  route="sigin"
                  title="SIGNIN"
                  icon={DocumentsIcon}
                  path="sigin"
                />
              </div>
            )}
          {roles?.['e-resident'] === 'e-resident' ? <GetCitizenshipCard /> : ''}
          {isLogoutModalOpen && (
            <LogoutModal
              handleLogout={handleLogout}
              closeModal={() => setLogoutIsModalOpen(false)}
            />
          )}
          {/* roles.citizen === 'citizen' ? <NextAssemblyCard /> : '' */}
        </div>
      </div>
      <div className={styles.mobileNavigationSpacer} />
    </div>
  );

  return isMedium ? desktopNavbar : mobileNavbar;
}

export default HomeNavigation;
