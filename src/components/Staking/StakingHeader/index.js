import React from 'react';
import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: router.staking.overview,
    title: 'LLD STAKING',
  },
  {
    route: router.staking.ethlpstaking,
    title: 'ETH LP STAKING',
  },
];

function StakingHeader() {
  return (
    <Tabs navigationList={navigationList} />
  );
}

export default StakingHeader;
