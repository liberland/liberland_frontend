import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';
import router from '../../router';
import Motions from './Motions';
import Wallet from './Wallet';
import ScheduledCongressSpending from './ScheduledCongressSpending';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';

function MotionsWrapper() {
  return (
    <MotionProvider>
      <Motions />
    </MotionProvider>
  );
}

function ScheduledCongressSpendingWrapper() {
  return (
    <MotionProvider>
      <ScheduledCongressSpending isVetoButton />
    </MotionProvider>
  );
}

function Senate() {
  return (
    <Switch>
      <Route
        exact
        path={router.senate.motions}
        component={MotionsWrapper}
      />
      <Route exact path={router.senate.wallet} component={Wallet} />
      <Route
        exact
        path={router.senate.scheduledCongressSpending}
        render={ScheduledCongressSpendingWrapper}
      />
      <Route
        exact
        path={router.home.senate}
        render={() => <Redirect to={router.senate.wallet} />}
      />
    </Switch>
  );
}

export default Senate;
