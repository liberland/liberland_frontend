import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import OfficesHeader from './OfficesHeader';
import Identity from './Identity';
import CompanyRegistry from './CompanyRegistry';
import CompanyRegistryEdit from './CompanyRegistry/EditCompany';
import LandRegistry from './LandRegistry';
import Finances from './Finances';
import router from '../../router';

import stylesPage from '../../utils/pagesBase.module.scss';
import ScheduledCongressSpendingWrapper from './ScheduledCongressSpendingWrapper';

function Offices() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <OfficesHeader />
      </div>

      <div className={stylesPage.contentWrapper}>
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
      </div>
    </div>
  );
}

export default Offices;
