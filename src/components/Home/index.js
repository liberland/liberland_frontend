import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import router from '../../router';
import HomeHeader from './HomeHeader';
import HomeNavigation from './HomeNavigation';
import Wallet from '../Wallet';
import RoleHOC from '../../hocs/RoleHOC';
import Profile from '../Profile';

import styles from './styles.module.scss';
import Documents from '../Documents';

const Home = () => (
  <div>
    <div className={styles.homeContentWrapper}>
      <HomeNavigation />
      <div className={styles.homeMain}>
        <HomeHeader />
        <div className={styles.switchContentWrapper}>
          <Switch>
            <Route path={router.home.profile} component={Profile} />
            <Route path={router.home.feed} component={() => <div>Feed</div>} />
            <Route path={router.home.documents} component={Documents} />
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

    </div>
  </div>
);

export default Home;
