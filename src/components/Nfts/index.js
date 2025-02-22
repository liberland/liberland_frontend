import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

function NFTS() {
  return (
    <Switch>
      <Route path={router.nfts.overview} component={loader(() => import('./Overview'))} />
      <Route path={router.nfts.ownedNfts} component={loader(() => import('./OwnedNfts'))} />
      <Route path={router.nfts.collections} component={loader(() => import('./Collections'))} />
      <Route path={router.nfts.shop} component={loader(() => import('./OnSale'))} />
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
