import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../../router';
import RoleHOC from '../../../hocs/RoleHOC';
import { loaderFactory } from '../../../utils/loader';

const loader = loaderFactory(__dirname);

function TabsVoting() {
  return (
    <div>
      <Switch>
        <Route
          path={router.voting.congressionalAssemble}
          component={loader('../CongressionalAssemble')}
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
