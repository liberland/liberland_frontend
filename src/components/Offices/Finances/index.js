import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import { officesActions, financesActions } from '../../../redux/actions';
import { officesSelectors, financesSelectors } from '../../../redux/selectors';
import Table from '../../Table';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { palletIdToAddress } from '../../../utils/pallet';
import CurrencyIcon from '../../CurrencyIcon';

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

  if (!pallets || !balances) {
    return <Spin />;
  }

  const formatPercent = (value) => `${Math.round(10000 * value) / 100}%`;

  return (
    <Collapse
      defaultActiveKey={['wallet', 'finance']}
      items={[
        {
          label: 'Wallet addresses',
          key: 'wallet',
          children: (
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
              data={accountsAddresses.map((a) => ({
                ...a,
                address: a.address,
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
              }))}
              noPagination
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
                  value: formatPercent(finances.inflation),
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
                  value: formatPercent(finances.stakerApyWeeklyPayouts),
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
