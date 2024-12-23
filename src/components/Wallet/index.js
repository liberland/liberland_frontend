import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect, Route, Switch,
} from 'react-router-dom';
import router from '../../router';
import { blockchainSelectors } from '../../redux/selectors';
import styles from './styles.module.scss';
import Card from '../Card';
import { loader } from '../../utils/loader';
import { stockWrapper } from './StockContext';

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
          component={stockWrapper(loader(() => import('./Exchange')), false)}
        />
        <Route
          path={router.wallet.stockExchange}
          component={stockWrapper(loader(() => import('./Exchange')), true)}
        />
        <Route
          path={router.wallet.assets}
          component={stockWrapper(loader(() => import('./Assets')), false)}
        />
        <Route
          path={router.wallet.stocks}
          component={stockWrapper(loader(() => import('./Assets')), true)}
        />
        <Route
          path={router.wallet.bridge}
          component={loader(() => import('./Bridge'))}
        />
        <Route
          path={router.wallet.payMe}
          component={loader(() => import('./PayMe'))}
        />
        <Route
          exact
          path={router.home.wallet}
          render={() => (
            <Redirect to={router.wallet.overView} />
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
