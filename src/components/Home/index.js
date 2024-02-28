import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import router from '../../router';
import HomeHeader from './HomeHeader';
import HomeNavigation from './HomeNavigation';
import Wallet from '../Wallet';
import RoleHOC from '../../hocs/RoleHOC';
import Profile from '../Profile';
import Documents from '../Documents';
import Voting from '../Voting';
import Feed from '../Feed';
import Legislation from '../Legislation';
import Offices from '../Offices';
import Staking from '../Staking';
import Registries from '../Registries';
import AllTransactions from '../Wallet/AllTransactions';
import styles from './styles.module.scss';
import Congress from '../Congress';

import { blockchainSelectors } from '../../redux/selectors';

function Home() {
  const isWalletAdressSame = useSelector(
    blockchainSelectors.isUserWalletAddressSameAsUserAdress,
  );

  const alwaysRenderedRoutes = [
    <Route path={router.home.profile} component={Profile} />,
    <Route path={router.home.feed} component={Feed} />,
    <Route path={router.home.wallet} component={Wallet} />,
    <Route path={router.home.staking} component={Staking} />,
    <Route path={router.home.offices} component={Offices} />,
  ];

  const alwaysRenderedRoutesLast = (
    <Route
      exact
      path={router.home.index}
      render={() => (
        <RoleHOC>
          <Redirect to={router.home.feed} />
        </RoleHOC>
      )}
    />
  );

  const conditionalRoutes = [
    <Route path={router.home.documents} component={Documents} />,
    <Route path={router.home.voting} component={Voting} />,
    <Route path={router.home.legislation} component={Legislation} />,
    <Route path={router.home.registries} component={Registries} />,
    <Route path={router.wallet.allTransactions} component={AllTransactions} />,
    <Route path={router.home.congress} component={Congress} />,
  ];

  const renderRoutes = isWalletAdressSame
    ? [...alwaysRenderedRoutes, ...conditionalRoutes, alwaysRenderedRoutesLast]
    : [...alwaysRenderedRoutes, alwaysRenderedRoutesLast];
  return (
    <div>
      <div className={styles.homeContentWrapper}>
        <HomeNavigation />
        <div className={styles.homeMain}>
          <HomeHeader />
          <Switch>{renderRoutes}</Switch>
        </div>
      </div>
    </div>
  );
}

export default Home;
