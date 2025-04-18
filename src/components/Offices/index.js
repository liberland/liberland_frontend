import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import router from '../../router';
import { loader } from '../../utils/loader';

function Offices() {
  return (
    <Switch>
      <Route
        exact
        path={router.offices.identity}
        component={loader(() => import('./Identity'))}
      />
      <Route
        exact
        path={router.offices.companyRegistry.home}
        component={loader(() => import('./CompanyRegistry'))}
      />
      <Route
        exact
        path={router.offices.companyRegistry.edit}
        component={loader(() => import('./CompanyRegistry/EditCompany'))}
      />
      <Route
        exact
        path={router.home.offices}
        render={() => (
          <Redirect to={router.offices.ministryOfFinance} />
        )}
      />
      <Route
        exact
        path={router.offices.landRegistry}
        component={loader(() => import('./LandRegistry'))}
      />
      <Route
        exact
        path={router.offices.finances}
        component={loader(() => import('./Finances'))}
      />
      <Route
        exact
        path={router.offices.scheduledCongressSpending}
        component={loader(() => import('./ScheduledCongressSpendingWrapper'))}
      />
      <Route
        exact
        path={router.offices.ministryOfFinance}
        component={loader(() => import('./MinistryOfFinance'))}
      />
      <Route
        exact
        path={router.offices.taxPayers}
        component={loader(() => import('./TaxPayers'))}
      />
    </Switch>
  );
}

export default Offices;
