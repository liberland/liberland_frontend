import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';

import Layout from '../Layout';
import { loader } from '../../utils/loader';

function Home() {
  const renderRoutes = [
    <Route key={router.home.feed} path={router.home.feed} component={loader(() => import('../Feed'))} />,
    <Route key={router.home.congress} path={router.home.congress} component={loader(() => import('../Congress'))} />,
    <Route key={router.home.senate} path={router.home.senate} component={loader(() => import('../Senate'))} />,
    <Route
      key={router.home.legislation}
      path={router.home.legislation}
      component={loader(() => import('../Legislation'))}
    />,
    <Route key={router.home.voting} path={router.home.voting} component={loader(() => import('../Voting'))} />,
    <Route key={router.home.profile} path={router.home.profile} component={loader(() => import('../Profile'))} />,
    <Route key={router.home.wallet} path={router.home.wallet} component={loader(() => import('../Wallet'))} />,
    <Route key={router.home.staking} path={router.home.staking} component={loader(() => import('../Staking'))} />,
    <Route key={router.home.contracts} path={router.home.contracts} component={loader(() => import('../Contracts'))} />,
    <Route key={router.home.offices} path={router.home.offices} component={loader(() => import('../Offices'))} />,
    <Route
      key={router.home.registries}
      path={router.home.registries}
      component={loader(() => import('../Registries'))}
    />,
    <Route key={router.home.companies} path={router.home.companies} component={loader(() => import('../Companies'))} />,
    <Route key={router.home.documents} path={router.home.documents} component={loader(() => import('../Documents'))} />,
    <Route key={router.home.senate} path={router.home.senate} component={loader(() => import('../Senate'))} />,
    <Route key={router.home.nfts} path={router.home.nfts} component={loader(() => import('../Nfts'))} />,
    <Route
      exact
      key={router.home.index}
      path={router.home.index}
      render={() => (
        <Redirect to={router.home.feed} />
      )}
    />,
    <Route key={router.home.multisig} path={router.home.multisig} component={loader(() => import('../Multisig'))} />,
  ];

  return (
    <Layout>
      <Switch>{renderRoutes}</Switch>
    </Layout>
  );
}

export default Home;
