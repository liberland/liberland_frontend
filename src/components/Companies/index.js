import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

function Companies() {
  return (
    <Switch>
      <Route
        exact
        path={router.companies.myCompanies}
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
        path={router.companies.view}
        component={loader(() => import('./CompanyDetail'))}
      />
      <Route
        exact
        path={router.companies.allCompanies}
        component={loader(() => import('./AllCompanies'))}
      />
      <Route
        exact
        path={router.home.companies}
        render={() => (
          <Redirect to={router.companies.allCompanies} />
        )}
      />
    </Switch>
  );
}

export default Companies;
