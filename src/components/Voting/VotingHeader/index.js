import React from 'react';
import Tabs from '../../Tabs';
import Button from '../../Button/Button';
import router from '../../../router';

import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import styles from './styles.module.scss';

const navigationList = [
  {
    route: router.voting.congressionalAssemble,
    title: 'Congressional Assemble',
  },
  {
    route: router.voting.vetoVotes,
    title: 'Veto votes',

  },
  {
    route: router.voting.voteHistory,
    title: 'Vote history',
  },
];
const VotingHeader = () => (
  <>
    <Tabs navigationList={navigationList} />
    <Button primary className={styles.upcomingVotings}>
      <CalendarIcon />
      {' '}
      Upcoming votings
      {' '}
    </Button>
  </>
);

export default VotingHeader;
