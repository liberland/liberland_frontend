import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';

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
import RegistriesIcon from '../../../assets/icons/documents.svg';
import RegistriesIconActive from '../../../assets/icons/active-documents.svg';
import ConstitutionIconActive from '../../../assets/icons/active-constitution.svg';
import GraphIcon from '../../../assets/icons/graph.svg';

// REDUX
import { userSelectors, walletSelectors } from '../../../redux/selectors';

// CONSTANTS
// import roleEnums from '../../../constants/roleEnums';

// UTILS
import { formatMerits } from '../../../utils/walletHelpers';

function HomeNavigation() {
  const location = useLocation();
  const roles = useSelector(userSelectors.selectUserRole);
  const name = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const totalBalance = useSelector(walletSelectors.selectorTotalLLM);

  const title = name && lastName ? `${name} ${lastName}` : "Profile";
  const fullName = name && lastName ? `${name} ${lastName}` : undefined;
  const navigationList = [
    {
      route: router.home.profile,
      title: title,
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: () => <Avatar name={fullName} color="#FDF4E0" fgColor="#F1C823" round size="41px" />,
      description: `${formatMerits(totalBalance)} LLM`,
    },
    {
      route: router.home.feed,
      title: 'Feed',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: FeedIcon,
      activeIcon: FeedIconActive,
    },
    {
      route: router.home.documents,
      title: 'Documents',
      access: ['citizen', 'assemblyMember'],
      icon: DocumentsIcon,
      activeIcon: DocumentsIconActive,
    },
    {
      route: router.home.wallet,
      title: 'Wallet',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: WalletIcon,
      activeIcon: WalletIconActive,
    },
    {
      route: router.home.voting,
      title: 'Voting',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: VotingIcon,
      activeIcon: VotingIconActive,
    },
    {
      route: router.home.legislation,
      title: 'Legislation',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: ConstitutionIcon,
      activeIcon: ConstitutionIconActive,
    },
    {
      route: router.home.offices,
      title: 'Offices',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: ConstitutionIcon,
      activeIcon: ConstitutionIconActive,
    },
    {
      route: router.home.registries,
      title: 'Registries',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: RegistriesIcon,
      activeIcon: RegistriesIconActive,
    },
    {
      route: router.home.staking,
      title: 'Staking',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: RegistriesIcon,
      activeIcon: RegistriesIconActive,
    },
    {
      route: router.home.congress,
      title: 'Congress',
      access: ['citizen', 'assemblyMember', 'non_citizen'],
      icon: RegistriesIcon,
      activeIcon: RegistriesIconActive,
    },
  ];

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
          description,
        }) => (
          <RoleHOC key={route} roles={roles} access={access}>
            <NavigationLink
              route={route}
              title={title}
              icon={icon}
              activeIcon={activeIcon}
              path={location.pathname}
              description={description}
            />
          </RoleHOC>
        ))
      }
      {roles['e-resident'] === 'e-resident' ? <GetCitizenshipCard /> : ''}
      {/* roles.citizen === 'citizen' ? <NextAssemblyCard /> : '' */}
    </div>

  );
}

export default HomeNavigation;
