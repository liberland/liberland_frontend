import React from 'react';
import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: router.voting.congressionalAssemble,
    title: 'Congress',
  },
  {
    route: router.voting.referendum,
    title: 'Referenda',
  },
];

function VotingHeader() {
  return (
    <Tabs navigationList={navigationList} />
  );
}

export default VotingHeader;
