import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { useMediaQuery } from 'usehooks-ts';

// COMPONENTS
import NavigationLink from '../NavigationLink';
import RoleHOC from '../../../hocs/RoleHOC';
import router from '../../../router';
import Header from '../../AuthComponents/Header';
import GetCitizenshipCard from '../Cards/GetCitizenshipCard';

// ASSETS
import styles from './styles.module.scss';
import DocumentsIcon from '../../../assets/icons/documents.svg';
import DocumentsIconActive from '../../../assets/icons/active-documents.svg';
import FeedIcon from '../../../assets/icons/feed.svg';
import FeedIconActive from '../../../assets/icons/active-feed.svg';
import WalletIcon from '../../../assets/icons/wallet.svg';
import WalletIconActive from '../../../assets/icons/active-wallet.svg';
import VotingIcon from '../../../assets/icons/voting.svg';
import VotingIconActive from '../../../assets/icons/active-voting.svg';
import ConstitutionIcon from '../../../assets/icons/constitution.svg';
import ConstitutionIconActive from '../../../assets/icons/active-constitution.svg';
import OpenMenuIcon from '../../../assets/icons/menu.svg';
import CloseMenuIcon from '../../../assets/icons/close.svg';

// REDUX
import { userSelectors, walletSelectors } from '../../../redux/selectors';

// CONSTANTS
// import roleEnums from '../../../constants/roleEnums';

// UTILS
import { formatMerits } from '../../../utils/walletHelpers';
import { authActions } from '../../../redux/actions';
import LogoutModal from '../../Modals/LogoutModal';

function HomeNavigation() {
  const location = useLocation();
  const roles = useSelector(userSelectors.selectUserRole);
  const name = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const totalBalance = useSelector(walletSelectors.selectorTotalLLM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isMedium = useMediaQuery('(min-width: 48em)');

  const homeTitle = name && lastName ? `${name} ${lastName}` : 'PROFILE';
  const fullName = name && lastName ? `${name} ${lastName}` : undefined;
  const [isLogoutModalOpen, setLogoutIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(authActions.signOut.call(history));
    window.location.replace(process.env.REACT_APP_SSO_API_LOGOUT_IMPLICIT_LINK);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const navigationList = [
    {
      route: router.home.profile,
      title: homeTitle,
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      // eslint-disable-next-line react/no-unstable-nested-components
      icon: () => <Avatar name={fullName} color="#FDF4E0" fgColor="#F1C823" round size="41px" />,
      description: `${formatMerits(totalBalance)} LLM`,
      isDiscouraged: false,
    },
    {
      route: router.home.feed,
      title: 'FEED',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: FeedIcon,
      activeIcon: FeedIconActive,
      isDiscouraged: process.env.REACT_APP_IS_FEED_DISCOURAGED,
    },
    {
      route: router.home.wallet,
      title: 'WALLET',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: WalletIcon,
      activeIcon: WalletIconActive,
      isDiscouraged: process.env.REACT_APP_IS_WALLET_DISCOURAGED,
    },
    {
      route: router.home.voting,
      title: 'VOTING',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: VotingIcon,
      activeIcon: VotingIconActive,
      isDiscouraged: process.env.REACT_APP_IS_VOTING_DISCOURAGED,
    },
    {
      route: router.home.legislation,
      title: 'LEGISLATION',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: ConstitutionIcon,
      activeIcon: ConstitutionIconActive,
      isDiscouraged: process.env.REACT_APP_IS_LEGISLATION_DISCOURAGED,
    },
    {
      route: router.home.offices,
      title: 'OFFICES',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: ConstitutionIcon,
      activeIcon: ConstitutionIconActive,
      isDiscouraged: process.env.REACT_APP_IS_OFFICES_DISCOURAGED,
    },
    {
      route: router.home.registries,
      title: 'REGISTRIES',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: DocumentsIcon,
      activeIcon: DocumentsIconActive,
      isDiscouraged: process.env.REACT_APP_IS_REGISTRIES_DISCOURAGED,
    },
    {
      route: router.home.staking,
      title: 'STAKING',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: DocumentsIcon,
      activeIcon: DocumentsIconActive,
      isDiscouraged: process.env.REACT_APP_IS_STAKING_DISCOURAGED,
    },
    {
      route: router.home.congress,
      title: 'CONGRESS',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: DocumentsIcon,
      activeIcon: DocumentsIconActive,
      isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED,
    },
  ];

  const desktopNavbar = (
    <div className={`${styles.navigationWrapper}`}>
      <div className={styles.navigationContent}>
        <div className={styles.logoHeaderWrapper}>
          <Header />
        </div>
        {
          navigationList.map(({
            route,
            icon,
            activeIcon,
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
                activeIcon={activeIcon}
                path={location.pathname}
                description={description}
                isDiscouraged={isDiscouraged}
              />
            </RoleHOC>
          ))
        }
        <div onClick={
          () => setLogoutIsModalOpen(true)
        }
        >
          <NavigationLink
            route="logout"
            title="LOGOUT"
            icon={DocumentsIcon}
            activeIcon={DocumentsIcon}
            path="logout"
          />
        </div>
        {roles['e-resident'] === 'e-resident' ? <GetCitizenshipCard /> : ''}
        {isLogoutModalOpen && (
          <LogoutModal handleLogout={handleLogout} closeModal={() => setLogoutIsModalOpen(false)} />
        )}
        {/* roles.citizen === 'citizen' ? <NextAssemblyCard /> : '' */}
      </div>
    </div>
  );

  const mobileNavbar = (
    <div>
      <div className={`${styles.mobileNavigationWrapper} ${isMenuOpen && styles.mobileNavigationWrapperOpen}`}>
        <div className={styles.navbarNavigationWrapper} onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
          {
            navigationList.map(({
              route,
              icon,
              activeIcon,
              title,
              access,
              description,
              isDiscouraged,
            }) => (
              <div key={route} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <RoleHOC roles={roles} access={access}>
                  <NavigationLink
                    route={route}
                    title={title}
                    icon={icon}
                    activeIcon={activeIcon}
                    path={location.pathname}
                    description={description}
                    isDiscouraged={isDiscouraged}
                  />
                </RoleHOC>
              </div>
            ))
          }
          <div onClick={
            () => {
              setLogoutIsModalOpen(true);
              setIsMenuOpen(!isMenuOpen);
            }
          }
          >
            <NavigationLink
              route={router.home.feed}
              title="Logout"
              icon={DocumentsIcon}
              activeIcon={DocumentsIcon}
              path="logout"
            />
          </div>
          {roles['e-resident'] === 'e-resident' ? <GetCitizenshipCard /> : ''}
          {isLogoutModalOpen && (
            <LogoutModal handleLogout={handleLogout} closeModal={() => setLogoutIsModalOpen(false)} />
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
