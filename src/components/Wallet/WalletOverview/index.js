import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Collapse from 'antd/es/collapse';
import Dropdown from 'antd/es/dropdown';
import Flex from 'antd/es/flex';
import Space from 'antd/es/space';
import uniqBy from 'lodash/uniqBy';
import { useMediaQuery } from 'usehooks-ts';
import DownOutlined from '@ant-design/icons/DownOutlined';
import uniq from 'lodash/uniq';
import { isAddress } from '@polkadot/util-crypto';
import BalanceOverview from '../BalanceOverview';
import WalletTransactionHistory from '../WalletTransactionHistory';
import AssetOverview from '../AssetOverview';
import { identityActions, walletActions } from '../../../redux/actions';
import { walletSelectors, blockchainSelectors, congressSelectors } from '../../../redux/selectors';
import Button from '../../Button/Button';
import { transactionHistoryProcessorFactory } from '../WalletTransactionHistory/utils';
import styles from './styles.module.scss';
import WalletTransactionHistoryMobile from '../WalletTransactionHistoryMobile';

function WalletOverview() {
  const [filterTransactionsBy, setFilterTransactionsBy] = useState();

  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);
  const historyFetchFailed = useSelector(walletSelectors.selectorTxHistoryFailed);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const dispatch = useDispatch();

  const transactionHistoryTranslated = useMemo(
    () => transactionHistory?.map(transactionHistoryProcessorFactory(userWalletAddress)) || [],
    [transactionHistory, userWalletAddress],
  );

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getAdditionalAssets.call());
    dispatch(walletActions.getTxTransfers.call());
  }, [dispatch, userWalletAddress]);

  const selector = (
    <Flex align="center" gap="15px">
      <span className={styles.description}>
        Show
      </span>
      <Dropdown
        trigger={['click']}
        arrow={false}
        menu={{
          items: [{ key: '', label: 'All transaction types' }]
            .concat(uniqBy(transactionHistoryTranslated, ({ typeText }) => typeText).map(({ typeText }) => ({
              key: typeText,
              label: typeText,
            }))),
          onClick: ({ key }) => {
            setFilterTransactionsBy(key);
          },
        }}
      >
        <Button>
          <Space>
            {filterTransactionsBy || 'All transaction types'}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Flex>
  );

  useEffect(() => {
    const addresses = uniq(
      transactionHistoryTranslated?.map(({ userId }) => userId),
    ).filter((address) => isAddress(address));
    if (addresses?.length) {
      dispatch(identityActions.getIdentityMotions.call(
        addresses,
      ));
    }
  }, [dispatch, transactionHistoryTranslated]);

  return (
    <Collapse
      defaultActiveKey={['BalanceOverview', 'AssetOverview', 'WalletTransactionHistory']}
      collapsible="icon"
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
              userIsMember={userIsMember}
            />
          ),
        },
        {
          key: 'WalletTransactionHistory',
          label: 'Transaction history',
          extra: isDesktop ? selector : undefined,
          children: isDesktop ? (
            <WalletTransactionHistory
              failure={historyFetchFailed}
              transactionHistory={transactionHistoryTranslated}
              filterTransactionsBy={filterTransactionsBy}
            />
          ) : (
            <Flex vertical gap="15px">
              {selector}
              <WalletTransactionHistoryMobile
                failure={historyFetchFailed}
                transactionHistory={transactionHistoryTranslated}
                filterTransactionsBy={filterTransactionsBy}
              />
            </Flex>
          ),
        },
      ]}
    />
  );
}

export default WalletOverview;
