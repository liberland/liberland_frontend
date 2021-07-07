import React from 'react';
import styles from '../styles.module.scss';
import Tabs from '../../Tabs';
import Button from '../../Button/Button';
import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import router from '../../../router';

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
  <div className={styles.navWrapper}>
    <Tabs navigationList={navigationList} />
    <Button primary small className={styles.upcomingVotings}>
      <CalendarIcon />
      {' '}
      Upcoming votings
      {' '}
    </Button>
  </div>
);

export default VotingHeader;
