import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';

import Layout from '../Layout';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Home() {
  const renderRoutes = [
    <Route key={router.home.feed} path={router.home.feed} component={loader('../Feed')} />,
    <Route key={router.home.congress} path={router.home.congress} component={loader('../Congress')} />,
    <Route key={router.home.senate} path={router.home.senate} component={loader('../Senate')} />,
    <Route key={router.home.legislation} path={router.home.legislation} component={loader('../Legislation')} />,
    <Route key={router.home.voting} path={router.home.voting} component={loader('../Voting')} />,
    <Route key={router.home.profile} path={router.home.profile} component={loader('../Profile')} />,
    <Route key={router.home.wallet} path={router.home.wallet} component={loader('../Wallet')} />,
    <Route key={router.home.staking} path={router.home.staking} component={loader('../Staking')} />,
    <Route key={router.home.contracts} path={router.home.contracts} component={loader('../Contracts')} />,
    <Route key={router.home.offices} path={router.home.offices} component={loader('../Offices')} />,
    <Route key={router.home.registries} path={router.home.registries} component={loader('../Registries')} />,
    <Route key={router.home.companies} path={router.home.companies} component={loader('../Companies')} />,
    <Route key={router.home.documents} path={router.home.documents} component={loader('../Documents')} />,
    <Route
      key={router.wallet.allTransactions}
      path={router.wallet.allTransactions}
      component={loader('../Wallet/AllTransactions')}
    />,
    <Route key={router.home.senate} path={router.home.senate} component={loader('../Senate')} />,
    <Route
      exact
      key={router.home.index}
      path={router.home.index}
      render={() => (
        <RoleHOC>
          <Redirect to={router.home.feed} />
        </RoleHOC>
      )}
    />,
  ];

  return (
    <Layout>
      <Switch>{renderRoutes}</Switch>
    </Layout>
  );
}

export default Home;
