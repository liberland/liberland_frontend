import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import router from '../../router';

import { walletSelectors, blockchainSelectors } from '../../redux/selectors';
import { walletActions } from '../../redux/actions';

import WalletAddressesLine from './WalletAddressesLine';
import styles from './styles.module.scss';
import stylesPage from '../../utils/pagesBase.module.scss';
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';
import Assets from './Assets';

import Card from '../Card';
import RoleHOC from '../../hocs/RoleHOC';
import AssetOverview from './AssetOverview';
import Exchange from './Exchange';
import Bridge from './Bridge';
import NftsComponent from './Nfts';

function Wallet() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);
  const historyFetchFailed = useSelector(walletSelectors.selectorTxHistoryFailed);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const dispatch = useDispatch();
  const history = useHistory();
  const redirectToViewAllTx = () => {
    history.push(router.wallet.allTransactions);
  };

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getAdditionalAssets.call());
    dispatch(walletActions.getTxTransfers.call());
  }, [dispatch, userWalletAddress]);

  const overView = () => (
    <div className={stylesPage.contentWrapper}>
      <WalletOverview
        totalBalance={totalBalance}
        balances={balances}
        liquidMerits={liquidMerits}
      />

      <AssetOverview
        additionalAssets={additionalAssets}
      />

      <WalletTransactionHistory
        failure={historyFetchFailed}
        transactionHistory={transactionHistory}
        textForBtn="View All Transactions"
        bottomButtonOnclick={redirectToViewAllTx}
      />
    </div>
  );

  return (
    (userWalletAddress !== undefined) ? (
      <div className={stylesPage.sectionWrapper}>
        <div className={stylesPage.menuAddressWrapper}>
          <WalletAddressesLine walletAddress={userWalletAddress} />
        </div>

        <div>
          <Switch>
            <Route
              path={router.wallet.overView}
              component={overView}
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
              exact
              path={router.home.wallet}
              render={() => (
                <RoleHOC>
                  <Redirect to={router.wallet.overView} />
                </RoleHOC>
              )}
            />
          </Switch>
        </div>
      </div>
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
