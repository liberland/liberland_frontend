import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';

import RegistriesOverview from './RegistriesOverview';
import RegistriesLand from './RegistriesLand';
import RegistriesAssets from './RegistriesAssets';
import RegistriesOther from './RegistriesOther';

function Registries() {
  return (
    <Switch>
      <Route
        exact
        path={router.registries.overview}
        component={RegistriesOverview}
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
        component={RegistriesLand}
      />
      <Route
        exact
        path={router.registries.assets}
        component={RegistriesAssets}
      />
      <Route
        exact
        path={router.registries.other}
        component={RegistriesOther}
      />
    </Switch>
  );
}

export default Registries;
