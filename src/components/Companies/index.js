import React from 'react';
import { Switch, Route } from 'react-router-dom';
import router from '../../router';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Companies() {
  return (
    <Switch>
      <Route
        exact
        path={router.companies.home}
        component={loader('./CompaniesOverview')}
      />
      <Route
        exact
        path={router.companies.create}
        component={loader('./CompaniesOverview/CreateCompany')}
      />
      <Route
        exact
        path={router.companies.edit}
        component={loader('./CompaniesOverview/EditCompany')}
      />
      <Route
        exact
        path={router.companies.allCompanies}
        component={loader('./AllCompanies')}
      />
    </Switch>
  );
}

export default Companies;
