import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

export default function Staking() {
  return (
    <Switch>
      <Route
        path={router.staking.overview}
        component={loader('./Overview')}
      />
      <Route
        path={router.staking.ethlpstaking}
        component={loader('./ETHLPStaking')}
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
