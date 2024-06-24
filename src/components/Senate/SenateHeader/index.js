import React from 'react';
import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.senate.wallet}`,
    title: 'Senate Wallet',
  },
  {
    route: `${router.senate.motions}`,
    title: 'Motions',
  },
  {
    route: `${router.senate.scheduledCongressSpending}`,
    title: 'Scheduled Congress Spending',
  },

];

export default function SenateHeader() {
  return <Tabs navigationList={navigationList} />;
}
