import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';
import cx from 'classnames';
import router from '../../router';
import stylesPage from '../../utils/pagesBase.module.scss';
import SenateHeader from './SenateHeader';
import Motions from './Motions';
import Wallet from './Wallet';
import styles from './styles.module.scss';
import ScheduledCongressSpending from './ScheduledCongressSpending';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import Overview from './Overview';

function MotionsWrapper() {
  return (
    <MotionProvider>
      <Motions />
    </MotionProvider>
  );
}

function Senate() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <SenateHeader />
      </div>
      <div className={cx(stylesPage.contentWrapper, styles.senateWrapper)}>
        <Switch>
          <Route
            exact
            path={router.senate.overview}
            component={Overview}
          />
          <Route
            exact
            path={router.senate.motions}
            component={MotionsWrapper}
          />
          <Route exact path={router.senate.wallet} component={Wallet} />
          <Route
            exact
            path={router.senate.scheduledCongressSpending}
            render={() => <ScheduledCongressSpending isVetoButton />}
          />
          <Route
            exact
            path={router.home.senate}
            render={() => <Redirect to={router.senate.overview} />}
          />
        </Switch>
      </div>
    </div>
  );
}

export default Senate;
