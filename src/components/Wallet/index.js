import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect, Route, Switch,
} from 'react-router-dom';
import router from '../../router';

import { blockchainSelectors } from '../../redux/selectors';

import styles from './styles.module.scss';
import Assets from './Assets';

import Card from '../Card';
import RoleHOC from '../../hocs/RoleHOC';

import Exchange from './Exchange';
import Bridge from './Bridge';
import NftsComponent from './Nfts';
import PayMe from './PayMe';
import WalletOverview from './WalletOverview';

function Wallet() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  return (
    (userWalletAddress !== undefined) ? (
      <Switch>
        <Route
          path={router.wallet.overView}
          component={WalletOverview}
        />
        <Route
          path={router.wallet.exchange}
          component={Exchange}
        />
        <Route
          path={router.wallet.assets}
          component={Assets}
        />
        <Route
          path={router.wallet.bridge}
          component={Bridge}
        />
        <Route
          path={router.wallet.nfts}
          component={NftsComponent}
        />
        <Route
          path={router.wallet.payMe}
          component={PayMe}
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
