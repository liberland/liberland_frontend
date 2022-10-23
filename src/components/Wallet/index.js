import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import routes from '../../router';

import { walletSelectors, blockchainSelectors } from '../../redux/selectors';
import { walletActions } from '../../redux/actions';

import WalletAddressesLine from './WalletAddressesLine';
import styles from './styles.module.scss';
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';
import Card from '../Card';
import Nominator from './Nominator';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';

const Wallet = () => {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorHistoryTx);

  const dispatch = useDispatch();
  const history = useHistory();

  const redirectToViewAllTx = () => {
    history.push(routes.wallet.allTransactions);
  };

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getThreeTx.call());
    dispatch(walletActions.getValidators.call());
    dispatch(walletActions.getNominatorTargets.call());
  }, [dispatch]);

  return (
    <>
      { (userWalletAddress !== undefined) ? (
        <div className={styles.walletWrapper}>
          <WalletAddressesLine walletAddress={userWalletAddress} />
          <div>
            <Switch>
              <Route
                path={router.wallet.validatorsStaking}
                component={() => (
                  <Nominator />
                )}
              />
              <Route
                path={router.wallet.overView}
                component={() => (
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
                )}
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
      )}
    </>
  );
};

export default Wallet;
