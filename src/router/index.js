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
    constitution: '/home/law',
    assembly: '/home/assembly',
  },
  documents: {
    myAccount: '/home/documents/my-account',
    citizenshipHistory: '/home/documents/citizenship-history',
    landOwnership: '/home/documents/land-ownership',
    courtCases: '/home/documents/court-cases',
  },
  voting: {
    congressionalAssemble: '/home/voting/congressional-assemble',
    vetoVotes: '/home/voting/veto-votes',
    voteHistory: '/home/voting/vote-history',
    congressional: '/home/voting/congressional',
    currentCongressional: '/home/voting/congressional/:id',
  },
  assembly: {
    myDrafts: '/home/assembly/my-drafts',
    legislationVotes: '/home/assembly/legislation-votes',
    decisionVotes: '/home/assembly/decision-votes',
    voteHistory: '/home/assembly/vote-history',
    pmElection: '/home/assembly/pm-election',
  },
};
