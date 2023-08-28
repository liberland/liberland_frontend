import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.congress.overview}`,
    title: 'Overview',
  },
];

export default function CongressHeader() {
  return <Tabs navigationList={navigationList} />;
}
