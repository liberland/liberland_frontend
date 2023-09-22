import React, { useEffect } from 'react';
import { officesActions } from '../../../redux/actions';
import { officesSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import Table from "../../Table";
import { useDispatch, useSelector } from 'react-redux';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';

const ACCOUNTS = [
  {
    name: "Vault",
    address: "5EYCAe5hvejUE1BUTDSnxDfCqVkADRicSKqbcJrduV1KCDmk",
  },
  {
    name: "Senate",
    address: "5EYCAe5hveooUENA5d7dwq3caqM4LLBzktNumMKmhNRXu4JE",
  },
  {
    name: "Citizenship Office",
    address: "5EYCAe5iXF2YZuVZv1vig4xvf1CcDVocZCWYrv3TVSXpMTYA",
  },
  {
    name: "Treasury",
    address: "5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z",
  },
  {
    name: "Congress",
    address: "5EYCAe5g8CDuMsTief7QBxfvzDFEfws6ueXTUhsbx5V81nGH",
  },
  // FIXME 1 LLD faucet
];

export default function Finances() {
  const dispatch = useDispatch();
  const balances = useSelector(officesSelectors.selectorBalances);

  useEffect(() => {
    dispatch(officesActions.getBalances.call(ACCOUNTS.map(a => a.address)));
  }, [])

  return (
    <Table
      columns={[
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Address",
          accessor: "address"
        },
        {
          Header: "LLM Balance",
          accessor: "llm"
        },
        {
          Header: "LLD Balance",
          accessor: "lld"
        },
      ]}
      data={ACCOUNTS.map(a => {
        return Object.assign(a, {
          llm: formatMerits(balances.LLM[a.address] ?? 0) + ' LLM',
          lld: formatDollars(balances.LLD[a.address] ?? 0) + ' LLD',
        })
      })}
    />
  );
};