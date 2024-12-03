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
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Wallet() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  return (
    (userWalletAddress !== undefined) ? (
      <Switch>
        <Route
          path={router.wallet.overView}
          component={loader('./WalletOverview')}
        />
        <Route
          path={router.wallet.exchange}
          component={loader('./Exchange')}
        />
        <Route
          path={router.wallet.assets}
          component={loader('./Assets')}
        />
        <Route
          path={router.wallet.bridge}
          component={loader('./Bridge')}
        />
        <Route
          path={router.wallet.nfts}
          component={loader('./Nfts')}
        />
        <Route
          path={router.wallet.payMe}
          component={loader('./PayMe')}
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
