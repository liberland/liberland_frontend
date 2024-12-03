import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

function Registries() {
  return (
    <Switch>
      <Route
        exact
        path={router.registries.overview}
        component={loader(() => import('./RegistriesOverview'))}
      />
      <Route
        exact
        path={router.home.registries}
        render={() => (
          <Redirect to={router.registries.overview} />
        )}
      />
      <Route
        exact
        path={router.registries.land}
        component={loader(() => import('./RegistriesLand'))}
      />
      <Route
        exact
        path={router.registries.assets}
        component={loader(() => import('./RegistriesAssets'))}
      />
      <Route
        exact
        path={router.registries.other}
        component={loader(() => import('./RegistriesOther'))}
      />
    </Switch>
  );
}

export default Registries;
