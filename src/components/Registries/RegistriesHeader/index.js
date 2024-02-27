import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.registries.overview}`,
    title: 'Overview',
  },
  {
    route: `${router.registries.companies.overview}`,
    title: 'My Companies',
  },
  {
    route: `${router.registries.allCompanies}`,
    title: 'Companies',
  },
  {
    route: `${router.registries.land}`,
    title: 'Land',
  },
  {
    route: `${router.registries.assets}`,
    title: 'Assets',
  },
  {
    route: `${router.registries.other}`,
    title: 'Other',
  },
];

function RegistriesHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default RegistriesHeader;
