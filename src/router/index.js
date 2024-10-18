export default {
  signUp: '/signup',
  signIn: '/liberland-login',
  home: {
    index: '/home',
    feed: '/home/feed',
    documents: '/home/documents',
    wallet: '/home/wallet',
    voting: '/home/voting',
    profile: '/home/profile',
    legislation: '/home/legislation',
    registries: '/home/registries',
    offices: '/home/offices',
    staking: '/home/staking',
    congress: '/home/congress',
    contracts: '/home/contracts',
    companies: '/home/companies',
    senate: '/home/senate',
  },
  guidedSetup: '/guided-setup',
  offices: {
    identity: '/home/offices/identity',
    companyRegistry: {
      home: '/home/offices/company_registry',
      edit: '/home/offices/company_registry/edit/:companyId',
    },
    landRegistry: '/home/offices/land_registry',
    finances: '/home/offices/finances',
    scheduledCongressSpending: '/home/offices/scheduled-congress-spending',
  },
  documents: {
    myAccount: '/home/documents/my-account',
    citizenshipHistory: '/home/documents/citizenship-history',
    landOwnership: '/home/documents/land-ownership',
    courtCases: '/home/documents/court-cases',
  },
  voting: {
    congressionalAssemble: '/home/voting/congressional-assemble',
    referendum: '/home/voting/referendum',
    addLegislation: '/home/voting/add-legislation',
  },
  legislation: {
    view: '/home/legislation/:tier',
  },
  wallet: {
    exchange: '/home/wallet/exchange',
    allTransactions: '/home/wallet/all-transactions',
    overView: '/home/wallet/overview',
    bridge: '/home/wallet/bridge',
    nfts: '/home/wallet/nfts',
  },
  registries: {
    overview: '/home/registries/overview',
    allCompanies: '/home/registries/allCompanies',
    land: '/home/registries/land',
    assets: '/home/registries/assets',
    other: '/home/registries/other',
  },
  staking: {
    overview: '/home/staking/overview',
  },
  congress: {
    overview: '/home/congress/overview',
    motions: '/home/congress/motions',
    treasury: '/home/congress/treasury',
    addLegislation: '/home/congress/add-legislation',
    addLegislationViaReferendum:
      '/home/congress/add-legislation-via-referendum',
    wallet: '/home/congress/wallet',
  },
  senate: {
    motions: '/home/senate/motions',
    scheduledCongressSpending: '/home/senate/scheduled-congress-spending',
    wallet: '/home/senate/wallet',
    overview: '/home/senate/overview',
  },
  contracts: {
    overview: '/home/contracts/overview',
    myContracts: '/home/contracts/my-contracts',
    item: '/home/contracts/overview/browser/:id',
  },
  companies: {
    home: '/home/companies',
    create: '/home/companies/create',
    edit: '/home/companies/edit/:companyId',
    allCompanies: '/home/companies/allCompanies',
  },
};
