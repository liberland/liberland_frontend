import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';
import stylesPage from '../../utils/pagesBase.module.scss';

import RoleHOC from '../../hocs/RoleHOC';
import Tabs from '../Tabs';
import NftsComponent from './Overview';
import OwnedNfts from './OwnedNfts';
import Collections from './Collections';
import OnSale from './OnSale';

function NFTS() {
  const navigationList = [
    {
      route: router.nfts.overview,
      title: 'OVERVIEW',
    },
    {
      route: router.nfts.ownedNfts,
      title: 'OWNED NFTS',
    },
    {
      route: router.nfts.collections,
      title: 'COLLECTIONS',
    },
    {
      route: router.nfts.shop,
      title: 'ON SALE',
    },
  ];

  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <Tabs navigationList={navigationList} arrowBack />
      </div>

      <div>
        <Switch>
          <Route path={router.nfts.overview} component={NftsComponent} />
          <Route path={router.nfts.ownedNfts} component={OwnedNfts} />
          <Route path={router.nfts.collections} component={Collections} />
          <Route path={router.nfts.shop} component={OnSale} />
          <Route
            exact
            path={router.home.nfts}
            render={() => (
              <RoleHOC>
                <Redirect to={router.nfts.overview} />
              </RoleHOC>
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default NFTS;
