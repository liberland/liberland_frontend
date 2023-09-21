import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.home.legislation}/Constitution`,
    title: 'Constitution',
  },
  {
    route: `${router.home.legislation}/InternationalTreaty`,
    title: 'International Treaties',
  },
  {
    route: `${router.home.legislation}/Law`,
    title: 'Law',
  },
  {
    route: `${router.home.legislation}/Tier3`,
    title: 'Tier 3',
  },
  {
    route: `${router.home.legislation}/Tier4`,
    title: 'Tier 4',
  },
  {
    route: `${router.home.legislation}/Tier5`,
    title: 'Tier 5',
  },
  {
    route: `${router.home.legislation}/Decision`,
    title: 'Decisions',
  },
];

function LegislationHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default LegislationHeader;
