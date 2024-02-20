import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.home.legislation}/Constitution`,
    title: 'CONSTITUTION',
  },
  {
    route: `${router.home.legislation}/InternationalTreaty`,
    title: 'INTERNATIONAL TREATIES',
    mobileTitle: 'INT. TREATIES',
  },
  {
    route: `${router.home.legislation}/Law`,
    title: 'LAW',
  },
  {
    route: `${router.home.legislation}/Tier3`,
    title: 'TIER 3',
  },
  {
    route: `${router.home.legislation}/Tier4`,
    title: 'TIER 4',
  },
  {
    route: `${router.home.legislation}/Tier5`,
    title: 'TIER 5',
  },
  {
    route: `${router.home.legislation}/Decision`,
    title: 'DECISIONS',
  },
];

function LegislationHeader() {
  return <Tabs navigationList={navigationList} />;
}

export default LegislationHeader;
