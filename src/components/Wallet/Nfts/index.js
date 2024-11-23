import React from 'react';
import { Switch, Route } from 'react-router-dom';
import router from '../../../router';
import Collection from './Collection';
import Prime from './Prime';

function NftComponent() {
  return (
    <Switch>
      <Route path={router.wallet.nftsList} component={Collection} />
      <Route path={router.wallet.prime} component={Prime} />
    </Switch>
  );
}

export default NftComponent;
