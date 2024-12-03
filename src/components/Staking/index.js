import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';
import { loader } from '../../utils/loader';

export default function Staking() {
  return (
    <Switch>
      <Route
        path={router.staking.overview}
        component={loader(() => import('./Overview'))}
      />
      <Route
        path={router.staking.ethlpstaking}
        component={loader(() => import('./ETHLPStaking'))}
      />
      <Route
        exact
        path={router.home.staking}
        render={() => (
          <RoleHOC>
            <Redirect to={router.staking.overview} />
          </RoleHOC>
        )}
      />
    </Switch>
  );
}
