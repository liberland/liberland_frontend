import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import router from '../../router';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

export default function Contracts() {
  return (
    <Switch>
      <Route
        exact
        path={router.contracts.overview}
        component={loader('./Home')}
      />
      <Route
        exact
        path={router.contracts.myContracts}
        component={loader('./MyContracts')}
      />
      <Route path={router.contracts.item} component={loader('./Contract')} />
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
