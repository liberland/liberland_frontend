import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import router from '../../router';
import HomeHeader from './HomeHeader';
import HomeNavigation from './HomeNavigation';
import Wallet from '../Wallet';
import RoleHOC from '../../hocs/RoleHOC';

import styles from './styles.module.scss';

const Home = () => (
  <div>
    <HomeHeader />
    <div className={styles.homeContentWrapper}>
      <HomeNavigation />
      <Switch>
        <Route path={router.home.profile} component={() => <div>Profile</div>} />
        <Route path={router.home.feed} component={() => <div>Feed</div>} />
        <Route path={router.home.documents} component={() => <div>documents</div>} />
        <Route path={router.home.wallet} component={Wallet} />
        <Route path={router.home.voting} component={() => <div>voting</div>} />
        <Route path={router.home.constitution} component={() => <div>Feed</div>} />

        <Route
          exact
          path={router.home.index}
          render={() => (
            <RoleHOC>
              <Redirect to={router.home.feed} />
            </RoleHOC>
          )}
        />
      </Switch>
    </div>
  </div>
);

export default Home;
