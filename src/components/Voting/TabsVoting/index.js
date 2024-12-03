import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../../router';
import RoleHOC from '../../../hocs/RoleHOC';
import { loader } from '../../../utils/loader';

function TabsVoting() {
  return (
    <div>
      <Switch>
        <Route
          path={router.voting.congressionalAssemble}
          component={loader(() => import('../CongressionalAssemble'))}
        />
        <Route
          path={router.voting.referendum}
          // eslint-disable-next-line react/no-unstable-nested-components
          component={() => <div>Referendum</div>}
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
