import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.congress.overview}`,
    title: 'Overview',
  },
  {
    route: `${router.congress.motions}`,
    title: 'Motions',
  },
  {
    route: `${router.congress.treasury}`,
    title: 'LLD Treasury',
  },
  {
    route: `${router.congress.wallet}`,
    title: 'Congress wallet',
  },
];

export default function CongressHeader() {
  return <Tabs navigationList={navigationList} />;
}
