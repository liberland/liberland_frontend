import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Collapse from 'antd/es/collapse';
import BalanceOverview from '../BalanceOverview';
import WalletTransactionHistory from '../WalletTransactionHistory';
import AssetOverview from '../AssetOverview';
import { walletActions } from '../../../redux/actions';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';
import router from '../../../router';

function WalletOverview() {
  const history = useHistory();
  const redirectToViewAllTx = () => {
    history.push(router.wallet.allTransactions);
  };

  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);
  const historyFetchFailed = useSelector(walletSelectors.selectorTxHistoryFailed);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getAdditionalAssets.call());
    dispatch(walletActions.getTxTransfers.call());
  }, [dispatch, userWalletAddress]);

  return (
    <Collapse
      defaultActiveKey={['BalanceOverview', 'AssetOverview', 'WalletTransactionHistory']}
      items={[
        {
          key: 'BalanceOverview',
          label: 'Balance overview',
          children: (
            <BalanceOverview
              totalBalance={totalBalance}
              balances={balances}
              liquidMerits={liquidMerits}
            />
          ),
        },
        {
          key: 'AssetOverview',
          label: 'Additional assets',
          children: (
            <AssetOverview
              additionalAssets={additionalAssets}
            />
          ),
        },
        {
          key: 'WalletTransactionHistory',
          label: 'Transaction history',
          children: (
            <WalletTransactionHistory
              failure={historyFetchFailed}
              transactionHistory={transactionHistory}
              textForBtn="View All Transactions"
              bottomButtonOnclick={redirectToViewAllTx}
            />
          ),
        },
      ]}
    />
  );
}

export default WalletOverview;
