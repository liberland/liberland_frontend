import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.validators.overview}`,
    title: 'Overview',
  },
  {
    route: `${router.validators.hello}`,
    title: 'Hello',
  },
  {
    route: `${router.validators.world}`,
    title: 'World',
  },
];

function RegistriesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default RegistriesHeader;
