import React from 'react';

import Tabs from '../../Tabs';
import router from '../../../router';

const navigationList = [
  {
    route: `${router.home.legislation}/0`,
    title: 'Constitution',
  },
  {
    route: `${router.home.legislation}/1`,
    title: 'International Treaties',
  },
  {
    route: `${router.home.legislation}/2`,
    title: 'Tier 2',
  },
  {
    route: `${router.home.legislation}/3`,
    title: 'Tier 3',
  },
  {
    route: `${router.home.legislation}/4`,
    title: 'Tier 4',
  },
  {
    route: `${router.home.legislation}/5`,
    title: 'Tier 5',
  },
  {
    route: `${router.home.legislation}/6`,
    title: 'Decisions',
  },
];

const LegislationHeader = () => <Tabs navigationList={navigationList} />;

export default LegislationHeader;
