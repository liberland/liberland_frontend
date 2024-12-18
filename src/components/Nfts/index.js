import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';

import NftsComponent from './Overview';
import OwnedNfts from './OwnedNfts';
import Collections from './Collections';
import OnSale from './OnSale';

function NFTS() {
  return (
    <Switch>
      <Route path={router.nfts.overview} component={NftsComponent} />
      <Route path={router.nfts.ownedNfts} component={OwnedNfts} />
      <Route path={router.nfts.collections} component={Collections} />
      <Route path={router.nfts.shop} component={OnSale} />
      <Route
        exact
        path={router.home.nfts}
        render={() => (
          <Redirect to={router.nfts.overview} />
        )}
      />
    </Switch>
  );
}

export default NFTS;
