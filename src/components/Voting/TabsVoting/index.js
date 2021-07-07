import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../../router';
import CongressionalAssemble from '../CongressionalAssemble';
import RoleHOC from '../../../hocs/RoleHOC';

const TabsVoting = () => (
  <div>
    <Switch>
      <Route
        path={router.voting.congressionalAssemble}
        component={() => <CongressionalAssemble title="Congressional assembly" />}
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
);

export default TabsVoting;
