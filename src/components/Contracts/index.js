import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import router from '../../router';
import HomeContract from './Home';
import Contract from './Contract';
import MyContracts from './MyContracts';

export default function Contracts() {
  return (
    <Switch>
      <Route
        exact
        path={router.contracts.overview}
        component={HomeContract}
      />
      <Route
        exact
        path={router.contracts.myContracts}
        component={MyContracts}
      />
      <Route path={router.contracts.item} component={Contract} />
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
