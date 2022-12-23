import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../../router';
import CongressionalAssemble from '../CongressionalAssemble';
import RoleHOC from '../../../hocs/RoleHOC';

function TabsVoting() {
  return (
    <div>
      <Switch>
        <Route
          path={router.voting.congressionalAssemble}
          render={() => <CongressionalAssemble title="Congressional assembly" />}
        />
        <Route
          path={router.voting.referendum}
          render={() => <div>Referendum</div>}
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
}

export default TabsVoting;
