import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect, Route, Switch,
} from 'react-router-dom';
import router from '../../router';
import { blockchainSelectors } from '../../redux/selectors';
import styles from './styles.module.scss';
import Card from '../Card';
import RoleHOC from '../../hocs/RoleHOC';
import { loader } from '../../utils/loader';

function Wallet() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  return (
    (userWalletAddress !== undefined) ? (
      <Switch>
        <Route
          path={router.wallet.overView}
          component={loader(() => import('./WalletOverview'))}
        />
        <Route
          path={router.wallet.exchange}
          component={loader(() => import('./Exchange'))}
        />
        <Route
          path={router.wallet.assets}
          component={loader(() => import('./Assets'))}
        />
        <Route
          path={router.wallet.bridge}
          component={loader(() => import('./Bridge'))}
        />
        <Route
          path={router.wallet.nfts}
          component={loader(() => import('./Nfts'))}
        />
        <Route
          path={router.wallet.payMe}
          component={loader(() => import('./PayMe'))}
        />
        <Route
          exact
          path={router.home.wallet}
          render={() => (
            <RoleHOC>
              <Redirect to={router.wallet.overView} />
            </RoleHOC>
          )}
        />
      </Switch>
    ) : (
      <Card>
        <div className={styles.haveNotExtension}>
          <span>
            No extension installed, or you did not accept the authorization, please visit
            {' '}
            <a target="_blank" href="https://polkadot.js.org/extension/" rel="noopener noreferrer">polkadot.js.org</a>
            {' '}
            for more details.
          </span>
        </div>
      </Card>
    )
  );
}

export default Wallet;
