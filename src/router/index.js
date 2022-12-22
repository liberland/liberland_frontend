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
  },
  legislation: {
    view: '/home/legislation/:tier',
  },
  wallet: {
    allTransactions: '/home/wallet/all-transactions',
    validatorsStaking: '/home/wallet/validators-staking',
    overView: '/home/wallet/overview',
  },
};
