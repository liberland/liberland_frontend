import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.offices.identity}`,
    title: 'Citizenship (Identity)',
  },
  {
    route: `${router.offices.companyRegistry.home}`,
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
  {
    route: `${router.offices.scheduledCongressSpending}`,
    title: 'Scheduled Congress Spending',
  },
];

function OfficesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default OfficesHeader;
