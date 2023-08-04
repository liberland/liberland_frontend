import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.offices.identity}`,
    title: 'Citizenship (Identity)',
  },
  {
    route: `${router.offices.companyRegistry}`,
    title: 'Company Registry',
  },
  {
    route: `${router.offices.landRegistry}`,
    title: 'Land Registry',
  },
  {
    route: `${router.offices.finances}`,
    title: 'Government Finances',
  },
];

function OfficesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default OfficesHeader;
