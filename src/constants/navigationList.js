import FeedIcon from '../assets/icons/feed.svg';
import WalletIcon from '../assets/icons/wallet.svg';
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
    icon: FeedIcon,
    isDiscouraged: process.env.REACT_APP_IS_FEED_DISCOURAGED === 'true',
    subLinks: {},
  },
  {
    route: router.home.wallet,
    title: 'Finances',
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_WALLET_DISCOURAGED === 'true',
    subLinks: {
      Finances: router.wallet.overView,
      Exchange: router.wallet.exchange,
      'Stock exchange': router.wallet.stockExchange,
      Assets: router.wallet.assets,
      Stocks: router.wallet.stocks,
      Bridge: router.wallet.bridge,
    },
  },
  {
    route: router.home.nfts,
    title: 'NFTs',
    icon: FeedIcon,
    isDiscouraged: process.env.REACT_APP_IS_WALLET_DISCOURAGED === 'true',
    subLinks: {
      Overview: router.nfts.overview,
      'Owned NFTs': router.nfts.ownedNfts,
      Collections: router.nfts.collections,
      Shop: router.nfts.shop,
    },
  },
  {
    route: router.home.voting,
    title: 'Politics',
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_VOTING_DISCOURAGED === 'true',
    subLinks: {
      'Congressional Assemble': router.voting.congressionalAssemble,
      Referendum: router.voting.referendum,
      'Propose legislation': router.voting.addLegislation,
    },
  },
  {
    route: router.home.contracts,
    title: 'Contracts',
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONTRACTS_DISCOURAGED === 'true',
    subLinks: {
      Overview: router.contracts.overview,
      'My contracts': router.contracts.myContracts,
    },
  },
  {
    route: router.home.legislation,
    title: 'Legislation',
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_LEGISLATION_DISCOURAGED === 'true',
    subLinks: {
      Constitution: router.legislation.constitution,
      'International treaty': router.legislation.internationalTreaty,
      Law: router.legislation.law,
      'Tier 3': router.legislation.tier3,
      'Tier 4': router.legislation.tier4,
      'Tier 5': router.legislation.tier5,
      Decisions: router.legislation.decisions,
    },
  },
  {
    route: router.home.companies,
    title: 'Companies',
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_COMPANIES_DISCOURAGED === 'true',
    subLinks: {
      'All companies': router.companies.allCompanies,
      'My companies': router.companies.home,
    },
    extra: {
      [router.companies.home]: {
        link: router.companies.create,
        title: 'Register a new company',
      },
      [router.companies.allCompanies]: {
        link: router.companies.create,
        title: 'Register a new company',
      },
    },
  },
  {
    route: router.home.profile,
    title: 'Profile',
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_PROFILE_DISCOURAGED === 'true',
    subLinks: {},
  },
  {
    route: router.home.staking,
    title: 'Staking',
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_STAKING_DISCOURAGED === 'true',
    subLinks: {
      Overview: router.staking.overview,
      'ETH LP Staking': router.staking.ethlpstaking,
      'SOL LP Staking': router.staking.sollpstaking,
    },
  },
  {
    route: router.home.offices,
    title: 'Offices',
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_OFFICES_DISCOURAGED === 'true',
    isGovt: true,
    subLinks: {
      Identity: router.offices.identity,
      'Company registry': router.offices.companyRegistry.home,
      'Land registry': router.offices.landRegistry,
      Finances: router.offices.finances,
      'Scheduled Congress Spending': router.offices.scheduledCongressSpending,
      'Ministry Of Finance': router.offices.ministryOfFinance,
    },
  },
  {
    route: router.home.registries,
    title: 'Registries',
    icon: WalletIcon,
    isGovt: true,
    isDiscouraged: process.env.REACT_APP_IS_REGISTRIES_DISCOURAGED === 'true',
    subLinks: {
      Overview: router.registries.overview,
      'All companies': router.registries.allCompanies,
      Land: router.registries.land,
      Assets: router.registries.assets,
      Other: router.registries.other,
    },
  },
  {
    route: router.home.congress,
    title: 'Congress',
    icon: DocumentsIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED === 'true',
    isGovt: true,
    subLinks: {
      Overview: router.congress.overview,
      Motions: router.congress.motions,
      'Propose International treaty': router.congress.addLegislation,
      'Propose legislaton': router.congress.addLegislationViaReferendum,
      Wallet: router.congress.wallet,
    },
  },
  {
    route: router.home.senate,
    title: 'Senate',
    icon: WalletIcon,
    isDiscouraged: process.env.REACT_APP_IS_CONGRESS_DISCOURAGED === 'true',
    isGovt: true,
    subLinks: {
      Overview: router.senate.overview,
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
    About: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}about`,
    FAQ: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}faq`,
    Blockchain: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}blockchain`,
    Contributions: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}contribution`,
    Contacts: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}contact`,
  },
  Legal: {
    Constitution: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}constitution`,
    Laws: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}laws`,
    'Terms & conditions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}terms-and-conditions`,
    'Company terms & conditions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}company-terms-and-conditions`,
    'Gift agreement (CZ)': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}gift-agreement?country=cz`,
    'Gift agreement (SC)': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}gift-agreement?country=sc`,
    'Privacy policy': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}privacy-policy`,
  },
  Government: {
    Cabinet: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}government#president`,
    Congress: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}government#congress`,
    Elections: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}elections`,
    'Overseas Missions': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}government#overseas-missions`,
    'Liberland Gazette': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}gazette`,
  },
  Media: {
    News: `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}news`,
    Podcast: 'https://www.facebook.com/LiberlandShow/',
    YouTube: 'https://www.youtube.com/@LiberlandOfficial',
    'X/Twitter': 'https://twitter.com/liberland_org',
    'Liberland Press': 'https://liberlandpress.com',
  },
  Culture: {
    'Visit Liberland': 'https://visit.ll.land',
    Anniversary: 'https://anniversary.ll.land',
    'Floating Man Festival': 'https://floatingman.ll.land',
    'Diaspora villages': `${process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}diaspora-villages`,
  },
};
