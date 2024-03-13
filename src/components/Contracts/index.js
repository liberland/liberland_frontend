import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import stylesPage from '../../utils/pagesBase.module.scss';
import router from '../../router';
import HomeContract from './Home';
import Contract from './Contract';
import MyContracts from './MyContracts';
import RegistriesHeader from './ContractsHeader';

export default function Contracts() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <RegistriesHeader />
      </div>
      <div className={stylesPage.contentWrapper}>
        <Switch>
          <Route
            exact
            path={router.contracts.overview}
            component={HomeContract}
          />
          <Route
            exact
            path={router.contracts.myContracts}
            component={MyContracts}
          />
          <Route path={router.contracts.item} component={Contract} />
          <Route
            exact
            path={router.home.contracts}
            render={() => (
              <Redirect to={router.contracts.overview} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}
