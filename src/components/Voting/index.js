import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';
import Button from '../Button/Button';
import Tabs from '../Tabs';
import CongressionalAssemble from './CongressionalAssemble';

import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
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

const Voting = () => (
  <div className={styles.votingWrapper}>
    <div className={styles.navWrapper}>
      <Tabs navigationList={navigationList} />
      <Button primary small className={styles.upcomingVotings}>
        <CalendarIcon />
        {' '}
        Upcoming votings
        {' '}
      </Button>
    </div>

    <div>
      <Switch>
        <Route
          path={router.voting.congressionalAssemble}
          component={CongressionalAssemble}
        />
        <Route
          path={router.voting.vetoVotes}
          component={() => <div>Veto votes</div>}
        />
        <Route
          path={router.voting.voteHistory}
          component={() => <div>Vote history</div>}
        />
        <Route
          exact
          path={router.home.voting}
          render={() => (
            <RoleHOC>
              <Redirect to={router.voting.congressionalAssemble} />
            </RoleHOC>
          )}
        />
      </Switch>
    </div>
  </div>
);

export default Voting;
