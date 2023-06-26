import React from 'react';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../Button/Button';
import { SelectInput, TextInput } from '../../../InputComponents';
import {
  formatDollars, formatMerits, meritsToGrains, dollarsToGrains,
  valueToBN,
} from '../../../../utils/walletHelpers';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { bridgeActions } from '../../../../redux/actions';

import styles from '../styles.module.scss';

const toGrains = (asset, value) => (asset === 'LLM' ? meritsToGrains(value) : dollarsToGrains(value));

export function NewTransfer() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const lldLiquid = formatDollars(balances.liquidAmount.amount);
  const llmLiquid = formatMerits(liquidMerits);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      asset: 'LLM',
    },
  });

  const onSubmit = (values) => {
    dispatch(bridgeActions.deposit.call({
      userWalletAddress,
      values: {
        asset: values.asset,
        amount: toGrains(values.asset, values.amount),
        ethereumRecipient: values.recipient,
      },
    }));
    reset();
  };

  const asset = watch('asset');
  const selectedBalance = asset === 'LLM' ? liquidMerits : balances.liquidAmount.amount;
  return (
    <form className={styles.transferForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.input}>
        <SelectInput
          register={register}
          name="asset"
          options={[
            {
              value: 'LLM',
              display: `LLM (balance: ${llmLiquid} LLM)`,
            },
            {
              value: 'LLD',
              display: `LLD (balance: ${lldLiquid} LLD)`,
            },
          ]}
        />
      </div>

      <div className={styles.input}>
        <TextInput
          register={register}
          name="amount"
          placeholder="Amount"
          validate={(v) => v === '' || valueToBN(selectedBalance).gte(toGrains(asset, v)) || 'Insufficient balance'}
        />
        {errors?.amount?.type === 'validate'
          ? <p className={styles.error}>{errors.amount.message}</p> : null}
      </div>

      <div className={styles.input}>
        <TextInput
          register={register}
          name="recipient"
          placeholder="Ethereum recipient"
          validate={(v) => ethers.utils.isAddress(v) || 'Invalid Ethereum address'}
        />
        {errors?.recipient?.type === 'validate'
          ? <p className={styles.error}>{errors.recipient.message}</p> : null}
      </div>

      <div className={styles.input}>
        <Button
          primary
          medium
          type="submit"
        >
          Transfer
        </Button>
      </div>
    </form>
  );
}
