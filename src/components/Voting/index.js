import React from 'react';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';

import VotingHeader from './VotingHeader';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import CongressionalAssemble from './CongressionalAssemble';
import styles from './styles.module.scss';
import CongressionalAssemblyElectionsHeader from './CongressionalAssemblyElectionsHeader';
import CurrentCongressionalAssemble from './CurrentCongressionalAssemble';

const Voting = () => {
  const location = useLocation();
  const param = location.pathname.split('/').pop();

  return (
    <div className={styles.votingWrapper}>
      <div className={styles.navWrapper}>
        {
          Number(param)
            ? <CongressionalAssemblyElectionsHeader />
            : <VotingHeader />
        }
      </div>

      <div>
        <Switch>
          <Route
            exact
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
            path={router.voting.currentCongressional}
            component={CurrentCongressionalAssemble}
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
};

export default Voting;