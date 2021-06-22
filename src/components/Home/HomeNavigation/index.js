import React from 'react';
import { useLocation } from 'react-router-dom';

import NavigationLink from '../NavigationLink';
import RoleHOC from '../../../hocs/RoleHOC';
import router from '../../../router';

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
import Header from '../../AuthComponents/Header';
import GetCitizenshipCard from '../GetCitizenshipCard';

const navigationList = [
  {
    route: router.home.profile,
    title: 'Profile',
    // access: 'citizen',
  },
  {
    route: router.home.feed,
    title: 'Feed',
    icon: FeedIcon,
    activeIcon: FeedIconActive,
  },
  {
    route: router.home.documents,
    title: 'Documents',
    icon: DocumentsIcon,
    activeIcon: DocumentsIconActive,
  },
  {
    route: router.home.wallet,
    title: 'Wallet',
    icon: WalletIcon,
    activeIcon: WalletIconActive,
  },
  {
    route: router.home.voting,
    title: 'Voting',
    icon: VotingIcon,
    activeIcon: VotingIconActive,
  },
  {
    route: router.home.constitution,
    title: 'Constitution',
    icon: ConstitutionIcon,
    activeIcon: ConstitutionIconActive,
  },
];

const HomeNavigation = () => {
  const location = useLocation();

  return (
    <div className={styles.navigationWrapper}>
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
        }) => (
          <RoleHOC key={route} access={access}>
            <NavigationLink
              route={route}
              title={title}
              icon={icon}
              activeIcon={activeIcon}
              path={location.pathname}
            />
          </RoleHOC>
        ))
      }
      <GetCitizenshipCard />
    </div>

  );
};

export default HomeNavigation;
