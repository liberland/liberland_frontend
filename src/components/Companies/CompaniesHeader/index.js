import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.companies.home}`,
    title: 'Overview',
  },
  {
    route: `${router.companies.allCompanies}`,
    title: 'Companies',
  },
];

function CompaniesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default CompaniesHeader;
