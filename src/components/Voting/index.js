import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import VotingHeader from './VotingHeader';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import CongressionalAssemble from './CongressionalAssemble';
import styles from './styles.module.scss';

const Voting = () => (
  <div className={styles.votingWrapper}>
    <div className={styles.navWrapper}>
      <VotingHeader />
    </div>

    <div>
      <Switch>
        <Route
          path={router.voting.congressionalAssemble}
          component={() => <CongressionalAssemble title="Current assembly" />}
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
