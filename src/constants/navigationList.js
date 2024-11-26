import FeedIcon from '../assets/icons/feed.svg';
import WalletIcon from '../assets/icons/wallet.svg';
import VotingIcon from '../assets/icons/voting.svg';
import ConstitutionIcon from '../assets/icons/constitution.svg';
import DocumentsIcon from '../assets/icons/documents.svg';
import LinkedIn from '../assets/icons/linkedin.svg';
import Meta from '../assets/icons/meta.svg';
import X from '../assets/icons/x.svg';
import YouTube from '../assets/icons/youtube.svg';
import Telegram from '../assets/icons/telegram.svg';
import router from '../router';

export const navigationList = [
  {
    route: router.home.feed,
    title: 'Feed',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: FeedIcon,
    isDiscouraged: process.env.REACT_APP_IS_FEED_DISCOURAGED,
    subLinks: {},
    hideTitle: true,
  },
  {
    route: router.home.wallet,
    title: 'Wallet',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_WALLET_DISCOURAGED,
    subLinks: {
      Overview: router.wallet.overView,
      Exchange: router.wallet.exchange,
      'Stock exchange': router.wallet.stockExchange,
      Assets: router.wallet.assets,
      Stocks: router.wallet.stocks,
      'All transactions': router.wallet.allTransactions,
      Bridge: router.wallet.bridge,
      NFTs: router.wallet.nfts,
    },
  },
  {
    route: router.home.voting,
    title: 'Voting',
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
    title: 'Contracts',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONTRACTS_DISCOURAGED,
    subLinks: {
      Overview: router.contracts.overview,
      'My contracts': router.contracts.myContracts,
    },
  },
  {
    route: router.home.legislation,
    title: 'Legislation',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: ConstitutionIcon,
    isDiscouraged: process.env.REACT_APP_IS_LEGISLATION_DISCOURAGED,
    subLinks: {},
  },
  {
    route: router.home.offices,
    title: 'Offices',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: ConstitutionIcon,
    isDiscouraged: process.env.REACT_APP_IS_OFFICES_DISCOURAGED,
    isGovt: true,
    subLinks: {
      Identity: router.offices.identity,
      'Company registry': router.offices.companyRegistry.home,
      'Land registry': router.offices.landRegistry,
      Finances: router.offices.finances,
      'Scheduled Congress Spending': router.offices.scheduledCongressSpending,
    },
  },
  {
    route: router.home.companies,
    title: 'Companies',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_COMPANIES_DISCOURAGED,
    subLinks: {
      Companies: router.companies.home,
      Create: router.companies.create,
      'All companies': router.companies.allCompanies,
    },
  },
  {
    route: router.home.registries,
    title: 'Registries',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_REGISTRIES_DISCOURAGED,
    subLinks: {
      Overview: router.registries.overview,
      'All companies': router.registries.allCompanies,
      Land: router.registries.land,
      Assets: router.registries.assets,
      Other: router.registries.other,
    },
  },
  {
    route: router.home.staking,
    title: 'Staking',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_STAKING_DISCOURAGED,
    subLinks: {
      Overview: router.staking.overview,
      'ETH LP Staking': router.staking.ethlpstaking,
    },
  },
  {
    route: router.home.congress,
    title: 'Congress',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED,
    isGovt: true,
    subLinks: {
      Overview: router.congress.overview,
      Motions: router.congress.motions,
      Treasury: router.congress.treasury,
      'Add legislation': router.congress.addLegislation,
      'Add legislation via referendum': router.congress.addLegislationViaReferendum,
      Wallet: router.congress.wallet,
    },
  },
  {
    route: router.home.senate,
    title: 'Senate',
    access: ['citizen', 'assemblyMember', 'non_citizen', 'guest'],
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED,
    isGovt: true,
    subLinks: {
      Motions: router.senate.motions,
      'Scheduled Congress Spending': router.senate.scheduledCongressSpending,
      Wallet: router.senate.wallet,
    },
  },
];

export const socials = [
  {
    icon: LinkedIn,
    label: 'LinkedIn link',
    href: 'https://www.linkedin.com/company/liberland/',
  },
  {
    icon: Meta,
    label: 'Meta link',
    href: 'https://www.facebook.com/liberland/',
  },
  {
    icon: X,
    label: 'X/Twitter link',
    href: 'https://twitter.com/liberland_org',
  },
  {
    icon: YouTube,
    label: 'Youtube link',
    href: 'https://www.youtube.com/c/LiberlandOfficial',
  },
  {
    icon: Telegram,
    label: 'Telegram link',
    href: 'https://t.me/liberlanders',
  },
];

export const footerLinks = {
  About: {
    About: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/about`,
    FAQ: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/faq`,
    Blockchain: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/blockchain`,
    Contributions: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/contribution`,
    Contacts: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/contact`,
    'Space programme': 'https://app.charmverse.io/liberland-space-program/liberland-space-program-7985497939281838',
  },
  Legal: {
    Constitution: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/constitution`,
    Laws: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/laws`,
    'Terms & conditions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/terms-and-conditions`,
    'Company terms & conditions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/company-terms-and-conditions`,
    'Gift agreement (CZ)': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/gift-agreement?country=cz`,
    'Gift agreement (SC)': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/gift-agreement?country=sc`,
    'Privacy policy': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/privacy-policy`,
  },
  Government: {
    Cabinet: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/government#president`,
    Congress: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/government#congress`,
    Elections: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/elections`,
    'Overseas Missions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/government#overseas-missions`,
    'Liberland Gazette': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/gazette`,
  },
  Media: {
    News: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/news`,
    Podcast: 'https://www.facebook.com/LiberlandShow/',
    YouTube: 'https://www.youtube.com/@LiberlandOfficial',
    'X/Twitter': 'https://twitter.com/liberland_org',
    'Liberland Press': 'https://liberlandpress.com',
  },
  Culture: {
    'Visit Liberland': 'https://visit.ll.land',
    Anniversary: 'https://anniversary.ll.land',
    'Floating Man Festival': 'https://floatingman.ll.land',
    'Diaspora villages': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}/diaspora-villages`,
  },
};
