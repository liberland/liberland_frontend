import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.validators.overview}`,
    title: 'Overview',
  },
];

export default function ValidatorsHeader() {
  return <Tabs navigationList={navigationList} />;
}
