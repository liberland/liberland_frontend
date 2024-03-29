import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { officesActions } from '../../../redux/actions';
import { officesSelectors } from '../../../redux/selectors';
import Table from '../../Table';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { palletIdToAddress } from '../../../utils/pallet';
import truncate from '../../../utils/truncate';

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
    address: process.env.REACT_APP_ONBOARDER_LLD_FAUCET_ADDRESS
  }
]

export default function Finances() {
  const dispatch = useDispatch();
  const balances = useSelector(officesSelectors.selectorBalances);
  const pallets = useSelector(officesSelectors.selectorPallets);
  const [accountsAddresses, setAccountsAddresses] = useState([]);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
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

      palletsAndAddresses = palletsAndAddresses.concat(STATIC_ACCOUNTS)
      setAccountsAddresses(palletsAndAddresses);

      const addressesToFetchBalancesFor = palletsAndAddresses.map(
        ({ address }) => address,
      );
      dispatch(officesActions.getBalances.call(addressesToFetchBalancesFor));
    }
  }, [dispatch, pallets]);

  if (!pallets || !balances) return 'Loading...';

  return (
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
        llm: `${formatMerits(balances.LLM[a.address] ?? 0)} LLM`,
        lld: `${formatDollars(balances.LLD[a.address] ?? 0)} LLD`,
      }))}
    />
  );
}
