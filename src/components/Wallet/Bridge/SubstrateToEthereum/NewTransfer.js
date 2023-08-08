import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../Button/Button';
import { SelectInput, TextInput } from '../../../InputComponents';
import {
  formatDollars, formatMerits, meritsToGrains, dollarsToGrains,
  valueToBN,
} from '../../../../utils/walletHelpers';
import { walletSelectors, blockchainSelectors, bridgeSelectors } from '../../../../redux/selectors';
import { bridgeActions } from '../../../../redux/actions';

import styles from '../styles.module.scss';

const toGrains = (asset, value) => (asset === 'LLM' ? meritsToGrains(value) : dollarsToGrains(value));

export function NewTransfer() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const bridgesConstants = useSelector(bridgeSelectors.bridgesConstants);
  const lldLiquid = formatDollars(balances.liquidAmount.amount);
  const llmLiquid = formatMerits(liquidMerits);
  
  useEffect(() => {
    if (bridgesConstants === null)
      dispatch(bridgeActions.getBridgesConstants.call());
  }, [dispatch, bridgesConstants])


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

  if (!bridgesConstants) return null;

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
  const minTransfer = bridgesConstants[asset].minimumTransfer;

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
          validate={(v) => {
            if (v === '') return true;
            const grains = toGrains(asset, v);
            if (valueToBN(selectedBalance).lt(grains)) return 'Insufficient balance';
            const formatted = asset === 'LLM' ? formatMerits(minTransfer) : formatDollars(minTransfer);
            if (grains.lt(minTransfer)) return `Too low amount - minimum transfer is ${formatted} ${asset}`;
            return true;
          }}
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
