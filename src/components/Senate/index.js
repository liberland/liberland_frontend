import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';
import router from '../../router';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import { loader } from '../../utils/loader';

function MotionsWrapper() {
  const Motions = loader(() => import('./Motions'));
  return (
    <MotionProvider>
      <Motions />
    </MotionProvider>
  );
}

function Senate() {
  return (
    <Switch>
      <Route
        exact
        path={router.senate.overview}
        component={loader(() => import('./Overview'))}
      />
      <Route
        exact
        path={router.senate.motions}
        component={MotionsWrapper}
      />
      <Route exact path={router.senate.wallet} component={loader(() => import('./Wallet'))} />
      <Route
        exact
        path={router.senate.scheduledCongressSpending}
        render={loader(() => import('./ScheduledCongressSpendingWrapper'))}
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
