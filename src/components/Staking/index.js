import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';
import StakingOverview from './Overview';
import ETHLPStaking from './ETHLPStaking';

export default function Staking() {
  return (
    <Switch>
      <Route
        path={router.staking.overview}
        component={StakingOverview}
      />
      <Route
        path={router.staking.ethlpstaking}
        component={ETHLPStaking}
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
