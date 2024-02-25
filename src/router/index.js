export default {
  signIn: '/signin',
  signUp: '/signup',
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
    allTransactions: '/home/wallet/all-transactions',
    ethBridge: '/home/wallet/eth-bridge',
    ethBridgeDeposit: '/home/wallet/eth-bridge/deposit',
    ethBridgeWithdraw: '/home/wallet/eth-bridge/withdraw',
    overView: '/home/wallet/overview',
  },
  registries: {
    overview: '/home/registries/overview',
    companies: {
      home: '/home/registries/companies',
      overview: '/home/registries/companies/overview',
      create: '/home/registries/companies/create',
      edit: '/home/registries/companies/edit/:companyId',
    },
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
  },
};
