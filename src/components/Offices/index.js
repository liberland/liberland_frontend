import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import router from '../../router';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Offices() {
  return (
    <Switch>
      <Route
        exact
        path={router.offices.identity}
        component={loader('./Identity')}
      />
      <Route
        exact
        path={router.offices.companyRegistry.home}
        component={loader('./CompanyRegistry')}
      />
      <Route
        exact
        path={router.offices.companyRegistry.edit}
        component={loader('./CompanyRegistry/EditCompany')}
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
        component={loader('./LandRegistry')}
      />
      <Route
        exact
        path={router.offices.finances}
        component={loader('./Finances')}
      />
      <Route
        exact
        path={router.offices.scheduledCongressSpending}
        component={loader('./ScheduledCongressSpendingWrapper')}
      />
    </Switch>
  );
}

export default Offices;
