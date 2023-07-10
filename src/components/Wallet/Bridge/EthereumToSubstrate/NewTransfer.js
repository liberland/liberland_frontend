import React from 'react';
import { ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { useContractFunction } from '@usedapp/core';

import { isValidSubstrateAddress } from '../../../../utils/bridge';
import Button from '../../../Button/Button';
import { SelectInput, TextInput } from '../../../InputComponents';
import { ASSETS } from '../../../../api/eth';

import styles from '../styles.module.scss';
import { useDispatch } from 'react-redux';
import { bridgeActions } from '../../../../redux/actions';

export function NewTransfer({ ethBridges }) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      asset: 'LLM',
    },
  });

  const ethBridge = ethBridges[watch('asset')];

  const onSubmit = (values) => {
    const amount = ethers.utils.parseUnits(values.amount, ethBridge.token.decimals);
    const substrateRecipient = values.recipient;
    dispatch(bridgeActions.burn.call({ asset: values.asset, amount, substrateRecipient }));
    reset();
  };

  return (
    <form className={styles.transferForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.input}>
        <SelectInput
          register={register}
          name="asset"
          options={
                        ASSETS.map(
                          (asset) => ({
                            value: asset,
                            display: `${asset} (balance: ${ethers.utils.formatUnits(ethBridges[asset].balance, ethBridges[asset].token.decimals)} ${ethBridges[asset].token.symbol})`,
                          }),
                        )
                    }
        />
      </div>

      <div className={styles.input}>
        <TextInput
          register={register}
          name="amount"
          placeholder="Amount"
          validate={(v) => v === '' || ethBridge.balance.gte(ethers.utils.parseUnits(v, ethBridge.token.decimals)) || 'Insufficient balance'}
        />
        {errors?.amount?.type === 'validate'
          ? <p className={styles.error}>{errors.amount.message}</p> : null}
      </div>

      <div className={styles.input}>
        <TextInput
          register={register}
          name="recipient"
          placeholder="Liberland Blockchain recipient"
          validate={(v) => isValidSubstrateAddress(v) || 'Invalid Liberland Blockchain address'}
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
