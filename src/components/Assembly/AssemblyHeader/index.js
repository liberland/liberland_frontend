import React from 'react';
import router from '../../../router';

import Tabs from '../../Tabs';

const navigationList = [
  {
    route: router.assembly.myDrafts,
    title: 'My drafts',
  },
  {
    route: router.assembly.constitutionalChangeVotes,
    title: 'Constitutional Change Votes',

  },
  {
    route: router.assembly.legislationVotes,
    title: 'Legislation votes',

  },
  {
    route: router.assembly.decisionVotes,
    title: 'Decision votes',
  },
  {
    route: router.assembly.voteHistory,
    title: 'Vote history',
  },
  {
    route: router.assembly.pmElection,
    title: 'PM Election',
  },
];

const AssemblyHeader = () => (
  <>
    <Tabs navigationList={navigationList} />
  </>
);

export default AssemblyHeader;
