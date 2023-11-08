import React from 'react';
import {
  Switch, Route,
} from 'react-router-dom';
import router from '../../router';

import styles from './styles.module.scss';

import RegistriesHeader from './RegistriesHeader';
import RegistriesOverview from './RegistriesOverview';
import RegistriesCompanies from './RegistriesCompanies';
import RegistriesLand from './RegistriesLand';
import RegistriesAssets from './RegistriesAssets';
import RegistriesOther from './RegistriesOther';
import CreateCompany from './RegistriesCompanies/CreateCompany';
import EditCompany from './RegistriesCompanies/EditCompany';

function Registries() {
  return (
    <div className={styles.registriesWrapper}>
      <div className={styles.navWrapper}>
        <RegistriesHeader />
      </div>
      <div>
        <Switch>
          <Route
            exact
            path={router.registries.overview}
            component={RegistriesOverview}
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
