import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Collapse from 'antd/es/collapse';
import Dropdown from 'antd/es/dropdown';
import BalanceOverview from '../BalanceOverview';
import WalletTransactionHistory from '../WalletTransactionHistory';
import AssetOverview from '../AssetOverview';
import { walletActions } from '../../../redux/actions';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';
import router from '../../../router';
import { transactionHistoryProcessorFactory } from '../WalletTransactionHistory/utils';
import styles from './styles.module.scss';

function WalletOverview() {
  const history = useHistory();
  const redirectToViewAllTx = () => {
    history.push(router.wallet.allTransactions);
  };

  const [filterTransactionsBy, setFilterTransactionsBy] = React.useState();

  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);
  const historyFetchFailed = useSelector(walletSelectors.selectorTxHistoryFailed);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const dispatch = useDispatch();

  const transactionHistoryTranslated = React.useMemo(
    () => transactionHistory?.map(transactionHistoryProcessorFactory(userWalletAddress)) || [],
    [transactionHistory, userWalletAddress],
  );

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
          extra: (
            <>
              <span className={styles.description}>
                Show
              </span>
              <Dropdown.Button
                menu={{
                  items: [{ key: undefined, label: 'All transaction types' }]
                    .concat(transactionHistoryTranslated.map(({ typeText }) => ({
                      key: typeText,
                      label: typeText,
                    }))),
                  onClick: ({ key }) => {
                    setFilterTransactionsBy(key);
                  },
                }}
              >
                {filterTransactionsBy || 'All transaction types'}
              </Dropdown.Button>
            </>
          ),
          children: (
            <WalletTransactionHistory
              failure={historyFetchFailed}
              transactionHistory={transactionHistoryTranslated}
              textForBtn="View All Transactions"
              bottomButtonOnclick={redirectToViewAllTx}
              filterTransactionsBy={filterTransactionsBy}
            />
          ),
        },
      ]}
    />
  );
}

export default WalletOverview;
