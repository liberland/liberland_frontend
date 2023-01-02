import React from 'react';
import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: router.voting.congressionalAssemble,
    title: 'Congressional Assembly',
  },
  {
    route: router.voting.referendum,
    title: 'Referendum',
  },
];

const VotingHeader = () => {
  return (
    <Tabs navigationList={navigationList} />
  );
};

export default VotingHeader;
