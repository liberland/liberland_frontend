import React from 'react';
import { Switch, Route } from 'react-router-dom';
import router from '../../router';
import CompaniesOverview from './CompaniesOverview';
import CreateCompany from './CompaniesOverview/CreateCompany';
import EditCompany from './CompaniesOverview/EditCompany';
import AllCompanies from './AllCompanies';

function Companies() {
  return (
    <Switch>
      <Route
        exact
        path={router.companies.home}
        component={CompaniesOverview}
      />
      <Route
        exact
        path={router.companies.create}
        component={CreateCompany}
      />
      <Route
        exact
        path={router.companies.edit}
        component={EditCompany}
      />
      <Route
        exact
        path={router.companies.allCompanies}
        component={AllCompanies}
      />
    </Switch>
  );
}

export default Companies;
