import FeedIcon from '../assets/icons/feed.svg';
import WalletIcon from '../assets/icons/wallet.svg';
import VotingIcon from '../assets/icons/voting.svg';
import ConstitutionIcon from '../assets/icons/constitution.svg';
import DocumentsIcon from '../assets/icons/documents.svg';
import router from '../router';

export const navigationList = [
  {
    route: router.home.feed,
    title: 'FEED',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: FeedIcon,
    isDiscouraged: process.env.REACT_APP_IS_FEED_DISCOURAGED,
    subLinks: {},
  },
  {
    route: router.home.wallet,
    title: 'WALLET',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_WALLET_DISCOURAGED,
    subLinks: {
      Exchange: router.wallet.exchange,
      Assets: router.wallet.assets,
      'All transactions': router.wallet.allTransactions,
      Overview: router.wallet.overView,
      Bridge: router.wallet.bridge,
      NFTs: router.wallet.nfts,
      Payment: router.wallet.payMe,
    },
  },
  {
    route: router.home.voting,
    title: 'VOTING',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: VotingIcon,
    isDiscouraged: process.env.REACT_APP_IS_VOTING_DISCOURAGED,
    subLinks: {
      'Congressional Assemble': router.voting.congressionalAssemble,
      Referendum: router.voting.referendum,
      'Propose legislation': router.voting.addLegislation,
    },
  },
  {
    route: router.home.contracts,
    title: 'CONTRACTS',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONTRACTS_DISCOURAGED,
    subLinks: {
      Overview: router.contracts.overview,
      'My contracts': router.contracts.myContracts,
      Contract: router.contracts.item,
    },
  },
  {
    route: router.home.legislation,
    title: 'LEGISLATION',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: ConstitutionIcon,
    isDiscouraged: process.env.REACT_APP_IS_LEGISLATION_DISCOURAGED,
    subLinks: {
      Legislation: router.legislation.view,
    },
  },
  {
    route: router.home.offices,
    title: 'OFFICES',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: ConstitutionIcon,
    isDiscouraged: process.env.REACT_APP_IS_OFFICES_DISCOURAGED,
    isGovt: true,
    subLinks: {
      Identity: router.offices.identity,
      'Company registry': router.offices.companyRegistry.home,
      'Company registry edit': router.offices.companyRegistry.edit,
      'Land registry': router.offices.landRegistry,
      Finances: router.offices.finances,
      'Scheduled Congress Spending': router.offices.scheduledCongressSpending,
    },
  },
  {
    route: router.home.companies,
    title: 'COMPANIES',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_COMPANIES_DISCOURAGED,
    subLinks: {

    },
  },
  {
    route: router.home.registries,
    title: 'REGISTRIES',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_REGISTRIES_DISCOURAGED,
  },
  {
    route: router.home.staking,
    title: 'STAKING',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_STAKING_DISCOURAGED,
  },
  {
    route: router.home.congress,
    title: 'CONGRESS',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED,
    isGovt: true,
  },
  {
    route: router.home.senate,
    title: 'SENATE',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED,
    isGovt: true,
  },
];
