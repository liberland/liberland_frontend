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
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';
import Bridge from './Bridge';

import Card from '../Card';
import RoleHOC from '../../hocs/RoleHOC';

function Wallet() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);

  const dispatch = useDispatch();
  const history = useHistory();

  const redirectToViewAllTx = () => {
    history.push(router.wallet.allTransactions);
  };

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getLlmTransfers.call());
    dispatch(walletActions.getLldTransfers.call());
  }, [dispatch]);

  const overView = () => (
    <div>
      <WalletOverview
        totalBalance={totalBalance}
        balances={balances}
        liquidMerits={liquidMerits}
      />

      <WalletTransactionHistory
        transactionHistory={transactionHistory}
        textForBtn="View All Transactions"
        bottomButtonOnclick={redirectToViewAllTx}
      />
    </div>
  );

  return (
    (userWalletAddress !== undefined) ? (
      <div className={styles.walletWrapper}>
        <WalletAddressesLine walletAddress={userWalletAddress} />
        <div>
          <Switch>
            <Route
              path={router.wallet.ethBridge}
              component={Bridge}
            />
            <Route
              path={router.wallet.overView}
              component={overView}
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
