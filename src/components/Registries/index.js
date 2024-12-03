import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Registries() {
  return (
    <Switch>
      <Route
        exact
        path={router.registries.overview}
        component={loader('./RegistriesOverview')}
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
        component={loader('./RegistriesLand')}
      />
      <Route
        exact
        path={router.registries.assets}
        component={loader('./RegistriesAssets')}
      />
      <Route
        exact
        path={router.registries.other}
        component={loader('./RegistriesOther')}
      />
    </Switch>
  );
}

export default Registries;
