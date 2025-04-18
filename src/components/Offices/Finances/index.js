import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Descriptions from 'antd/es/descriptions';
import { useMediaQuery } from 'usehooks-ts';
import { officesActions, financesActions } from '../../../redux/actions';
import { officesSelectors, financesSelectors } from '../../../redux/selectors';
import Table from '../../Table';
import { formatCustom, formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { palletIdToAddress } from '../../../utils/pallet';
import CurrencyIcon from '../../CurrencyIcon';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import styles from './styles.module.scss';

const DEFAULT_ACCOUNTS = [
  {
    name: 'Vault',
    // source: frame/llm/src/lib.rs
    palletId: 'llm/safe',
  },
  {
    name: 'Senate',
    // source: frame/llm/src/lib.rs
    palletId: 'lltreasu',
  },
  {
    name: 'Ministry of Finance',
    palletId: 'off/fina',
  },
];

const DYNAMIC_ACCOUNTS = [
  {
    name: 'Citizenship Office',
    codeName: 'identityOffice',
  },
  {
    name: 'Treasury',
    codeName: 'treasury',
  },
  {
    name: 'Congress',
    codeName: 'councilAccount',
  },
  // FIXME 1 LLD faucet
];

const STATIC_ACCOUNTS = [
  {
    name: 'Onboarder LLD faucet',
    address: process.env.REACT_APP_ONBOARDER_LLD_FAUCET_ADDRESS,
  },
];

export default function Finances() {
  const dispatch = useDispatch();
  const balances = useSelector(officesSelectors.selectorBalances);
  const pallets = useSelector(officesSelectors.selectorPallets);
  const finances = useSelector(financesSelectors.selectorFinances);
  const financesLoading = useSelector(financesSelectors.selectorIsLoading);
  const [accountsAddresses, setAccountsAddresses] = useState([]);
  const isBigScreen = useMediaQuery('(min-width: 1500px)');

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
    dispatch(financesActions.getFinances.call());
  }, [dispatch]);

  useEffect(() => {
    if (pallets) {
      const palletIdsToFetchBalancesFor = [
        ...DEFAULT_ACCOUNTS,
        ...DYNAMIC_ACCOUNTS.map((account) => ({
          ...account,
          ...pallets.find((e) => e.palletName === account.codeName),
        })),
      ];

      let palletsAndAddresses = palletIdsToFetchBalancesFor.map(
        (palletData) => ({
          ...palletData,
          address: palletIdToAddress(palletData.palletId),
        }),
      );

      palletsAndAddresses = palletsAndAddresses.concat(STATIC_ACCOUNTS);
      setAccountsAddresses(palletsAndAddresses);

      const addressesToFetchBalancesFor = palletsAndAddresses.map(
        ({ address }) => address,
      );
      dispatch(officesActions.getBalances.call(addressesToFetchBalancesFor));
    }
  }, [dispatch, pallets]);

  const walletDataDisplay = useMemo(() => accountsAddresses.map((a) => ({
    ...a,
    address: (
      <div className="description">
        <CopyIconWithAddress address={a.address} />
      </div>
    ),
    llm: (
      <Flex wrap gap="10px" align="center">
        {formatMerits(balances.LLM[a.address] ?? 0)}
        <CurrencyIcon size={20} symbol="LLM" />
      </Flex>
    ),
    lld: (
      <Flex wrap gap="10px" align="center">
        {formatDollars(balances.LLD[a.address] ?? 0)}
        <CurrencyIcon size={20} symbol="LLD" />
      </Flex>
    ),
  })), [accountsAddresses, balances.LLD, balances.LLM]);

  if (!pallets || !balances) {
    return <Spin />;
  }

  const formatPercent = (value) => `${Math.round(10000 * value) / 100}%`;

  return (
    <Collapse
      defaultActiveKey={['wallet', 'finance']}
      collapsible="icon"
      items={[
        {
          label: 'Wallet addresses',
          key: 'wallet',
          children: isBigScreen ? (
            <Table
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Address',
                  accessor: 'address',
                },
                {
                  Header: 'LLM Balance',
                  accessor: 'llm',
                },
                {
                  Header: 'LLD Balance',
                  accessor: 'lld',
                },
              ]}
              data={walletDataDisplay}
              noPagination
            />
          ) : (
            <List
              dataSource={walletDataDisplay}
              itemLayout="horizontal"
              size="small"
              renderItem={({
                name,
                address,
                llm,
                lld,
              }) => (
                <List.Item>
                  <Card title={name} className={styles.card}>
                    <Descriptions
                      layout="vertical"
                      column={24}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Address" span={24}>
                        <strong>
                          {address}
                        </strong>
                      </Descriptions.Item>
                      <Descriptions.Item label="LLD" span={24}>
                        {lld}
                      </Descriptions.Item>
                      <Descriptions.Item label="LLM" span={24}>
                        {llm}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </List.Item>
              )}
            />
          ),
        },
        {
          label: 'Financial metrics',
          key: 'finance',
          children: financesLoading ? <Spin /> : finances && (
            <Table
              columns={[
                {
                  Header: 'Metric name',
                  accessor: 'metric',
                },
                {
                  Header: 'Metric value',
                  accessor: 'value',
                },
              ]}
              data={[
                {
                  metric: 'Inflation',
                  value: formatPercent(finances.inflation ?? 0),
                },
                {
                  metric: 'Congress rewards from last week',
                  value: (
                    <Flex wrap gap="10px" align="center">
                      {formatDollars(finances.lastWeekCongressRewards ?? 0)}
                      <CurrencyIcon size={20} symbol="LLD" />
                    </Flex>
                  ),
                },
                {
                  metric: 'Staker rewards from last week',
                  value: (
                    <Flex wrap gap="10px" align="center">
                      {formatDollars(finances.lastWeekStakersRewards ?? 0)}
                      <CurrencyIcon size={20} symbol="LLD" />
                    </Flex>
                  ),
                },
                {
                  metric: 'Staker APY',
                  value: formatPercent(finances.stakerApyWeeklyPayouts ?? 0),
                },
                {
                  metric: 'Total LLD',
                  value: (
                    <Flex wrap gap="10px" align="center">
                      {formatCustom(finances.totalLld ?? 0, 0)}
                      <CurrencyIcon size={20} symbol="LLD" />
                    </Flex>
                  ),
                },
              ]}
              noPagination
            />
          ),
        },
      ]}
    />
  );
}
