import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.validators.overview}`,
    title: 'Overview',
  },
];

function RegistriesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default RegistriesHeader;
