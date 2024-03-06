import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import stylesPage from '../../utils/pagesBase.module.scss';

import RegistriesHeader from './RegistriesHeader';
import RegistriesOverview from './RegistriesOverview';
import RegistriesCompanies from './RegistriesCompanies';
import RegistriesLand from './RegistriesLand';
import RegistriesAssets from './RegistriesAssets';
import RegistriesOther from './RegistriesOther';
import CreateCompany from './RegistriesCompanies/CreateCompany';
import EditCompany from './RegistriesCompanies/EditCompany';
import RegistriesAllCompanies from './RegistriesAllCompanies';

function Registries() {
  return (
    <div>
      <RegistriesHeader />
      <div className={stylesPage.contentWrapper}>
        <Switch>
          <Route
            exact
            path={router.registries.overview}
            component={RegistriesOverview}
          />
          <Route
            exact
            path={router.registries.companies.home}
            render={() => (
              <Redirect to={router.registries.companies.overview} />
            )}
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
            path={router.registries.companies.overview}
            component={RegistriesCompanies}
          />
          <Route
            exact
            path={router.registries.companies.create}
            component={CreateCompany}
          />
          <Route
            exact
            path={router.registries.allCompanies}
            component={RegistriesAllCompanies}
          />
          <Route
            exact
            path={router.registries.companies.edit}
            component={EditCompany}
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
      </div>
    </div>
  );
}

export default Registries;
