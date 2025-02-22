import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../../router';
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
          component={loader(() => import('../Referendum'))}
        />
        <Route
          exact
          path={router.home.voting}
          render={() => (
            <Redirect to={router.voting.congressionalAssemble} />
          )}
        />
      </Switch>
    </div>
  );
}

export default TabsVoting;
