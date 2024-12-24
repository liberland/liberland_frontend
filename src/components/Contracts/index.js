import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

export default function Contracts() {
  return (
    <Switch>
      <Route
        exact
        path={router.contracts.overview}
        component={loader(() => import('./Home'))}
      />
      <Route
        exact
        path={router.contracts.myContracts}
        component={loader(() => import('./MyContracts'))}
      />
      <Route path={router.contracts.item} component={loader(() => import('./Contract'))} />
      <Route
        exact
        path={router.home.contracts}
        render={() => (
          <Redirect to={router.contracts.overview} />
        )}
      />
    </Switch>
  );
}
