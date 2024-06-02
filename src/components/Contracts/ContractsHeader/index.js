import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.contracts.overview}`,
    title: 'Contracts',
  },
  {
    route: `${router.contracts.myContracts}`,
    title: 'My Contracts',
  },
];

function RegistriesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default RegistriesHeader;
