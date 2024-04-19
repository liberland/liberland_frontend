import React from 'react';
import { Switch, Route } from 'react-router-dom';
import stylesPage from '../../utils/pagesBase.module.scss';
import router from '../../router';
import CompaniesOverview from './CompaniesOverview';
import CreateCompany from './CompaniesOverview/CreateCompany';
import EditCompany from './CompaniesOverview/EditCompany';
import CompaniesHeader from './CompaniesHeader';
import AllCompanies from './AllCompanies';

function Companies() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <CompaniesHeader />
      </div>
      <div className={stylesPage.contentWrapper}>
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
      </div>
    </div>
  );
}

export default Companies;
