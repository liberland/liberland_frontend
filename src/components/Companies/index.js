import React from 'react';
import { Switch, Route } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

function Companies() {
  return (
    <Switch>
      <Route
        exact
        path={router.companies.home}
        component={loader(() => import('./CompaniesOverview'))}
      />
      <Route
        exact
        path={router.companies.create}
        component={loader(() => import('./CompaniesOverview/CreateCompany'))}
      />
      <Route
        exact
        path={router.companies.edit}
        component={loader(() => import('./CompaniesOverview/EditCompany'))}
      />
      <Route
        exact
        path={router.companies.view}
        component={loader(() => import('./CompanyDetail'))}
      />
      <Route
        exact
        path={router.companies.allCompanies}
        component={loader(() => import('./AllCompanies'))}
      />
    </Switch>
  );
}

export default Companies;
