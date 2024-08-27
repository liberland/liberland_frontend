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
import Companies from '../Companies';
import AllTransactions from '../Wallet/AllTransactions';
import styles from './styles.module.scss';
import Congress from '../Congress';

import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import Contracts from '../Contracts';
import Senate from '../Senate';
import SignUp from '../AuthComponents/SignUp';

function Home() {
  const isWalletAdressSame = useSelector(
    blockchainSelectors?.isUserWalletAddressSameAsUserAdress,
  );
  const user = useSelector(userSelectors.selectUser);

  const alwaysRenderedRoutes = [
    <Route key={router.home.feed} path={router.home.feed} component={Feed} />,
    <Route key={router.signUp} path={router.signUp} component={SignUp} />,
    <Route key={router.home.congress} path={router.home.congress} component={Congress} />,
    <Route key={router.home.senate} path={router.home.senate} component={Senate} />,
    <Route key={router.home.legislation} path={router.home.legislation} component={Legislation} />,
    <Route key={router.home.voting} path={router.home.voting} component={Voting} />,
  ];

  const loggedAlwaysRenderedRoutes = [
    <Route key={router.home.profile} path={router.home.profile} component={Profile} />,
    <Route key={router.home.wallet} path={router.home.wallet} component={Wallet} />,
    <Route key={router.home.staking} path={router.home.staking} component={Staking} />,
    <Route key={router.home.contracts} path={router.home.contracts} component={Contracts} />,
    <Route key={router.home.offices} path={router.home.offices} component={Offices} />,
    <Route key={router.home.registries} path={router.home.registries} component={Registries} />,
    <Route key={router.home.companies} path={router.home.companies} component={Companies} />,
  ];

  const alwaysRenderedRoutesLast = (
    <Route
      exact
      key={router.home.index}
      path={router.home.index}
      render={() => (
        <RoleHOC>
          <Redirect to={router.home.feed} />
        </RoleHOC>
      )}
    />
  );

  const conditionalRoutes = [
    <Route key={router.home.documents} path={router.home.documents} component={Documents} />,
    <Route key={router.wallet.allTransactions} path={router.wallet.allTransactions} component={AllTransactions} />,
  ];

  const checkRenderedRoutes = () => {
    if (!user) {
      return [...alwaysRenderedRoutes, alwaysRenderedRoutesLast];
    }
    if (!isWalletAdressSame) {
      return [...alwaysRenderedRoutes, ...loggedAlwaysRenderedRoutes, alwaysRenderedRoutesLast];
    }
    return [...alwaysRenderedRoutes, ...loggedAlwaysRenderedRoutes, ...conditionalRoutes, alwaysRenderedRoutesLast];
  };

  const renderRoutes = checkRenderedRoutes();

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
