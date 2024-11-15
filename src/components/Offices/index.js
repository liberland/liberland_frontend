import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import Identity from './Identity';
import CompanyRegistry from './CompanyRegistry';
import CompanyRegistryEdit from './CompanyRegistry/EditCompany';
import LandRegistry from './LandRegistry';
import Finances from './Finances';
import router from '../../router';

import ScheduledCongressSpendingWrapper from './ScheduledCongressSpendingWrapper';

function Offices() {
  return (
    <Switch>
      <Route
        exact
        path={router.offices.identity}
        component={Identity}
      />
      <Route
        exact
        path={router.offices.companyRegistry.home}
        component={CompanyRegistry}
      />
      <Route
        exact
        path={router.offices.companyRegistry.edit}
        component={CompanyRegistryEdit}
      />
      <Route
        exact
        path={router.home.offices}
        render={() => (
          <Redirect to={router.offices.identity} />
        )}
      />
      <Route
        exact
        path={router.offices.landRegistry}
        component={LandRegistry}
      />
      <Route
        exact
        path={router.offices.finances}
        component={Finances}
      />
      <Route
        exact
        path={router.offices.scheduledCongressSpending}
        component={ScheduledCongressSpendingWrapper}
      />
    </Switch>
  );
}

export default Offices;
