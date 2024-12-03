import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';
import router from '../../router';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function MotionsWrapper() {
  return (
    <MotionProvider>
      {loader('./Motions')}
    </MotionProvider>
  );
}

function Senate() {
  return (
    <Switch>
      <Route
        exact
        path={router.senate.overview}
        component={loader('./Overview')}
      />
      <Route
        exact
        path={router.senate.motions}
        component={MotionsWrapper}
      />
      <Route exact path={router.senate.wallet} component={loader('./Wallet')} />
      <Route
        exact
        path={router.senate.scheduledCongressSpending}
        render={loader('./ScheduledCongressSpendingWrapper')}
      />
      <Route
        exact
        path={router.home.senate}
        render={() => <Redirect to={router.senate.overview} />}
      />
    </Switch>
  );
}

export default Senate;
