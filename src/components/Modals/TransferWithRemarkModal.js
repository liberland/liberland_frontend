import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { BN } from '@polkadot/util';
import cx from 'classnames';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { SelectInput, TextInput } from '../InputComponents';
import {
  isValidSubstrateAddress, parseAssets,
} from '../../utils/walletHelpers';
import InputSearch from '../InputComponents/InputSearchAddressName';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { IndexHelper } from '../../utils/council/councilEnum';
import RemarkFormUser from '../Wallet/RemarkFormUser';
import Validator from '../../utils/validator';

const optionsInput = [{
  value: 'LLD',
  display: 'Liberland Dolar (LLD)',
  index: IndexHelper.LLD,
},
{
  value: 'POLITIPOOL_LLM',
  display: 'Politipool LLM',
  index: IndexHelper.POLITIPOOL_LLM,
}];

function TransferWithRemarkModal({
  closeModal,
  submit,
  userRemark,
  additionalAssets,
  maxUnbond,
  politipoolLlm,
}) {
  const options = useMemo(() => {
    const activeAssets = additionalAssets.filter((item) => item.balance?.balance > 0);

    const itemsArray = activeAssets.map((
      { index, metadata, balance },
    ) => ({
      index,
      display: `${metadata.name} (${metadata.symbol})`,
      value: metadata.symbol,
      decimals: metadata.decimals,
      balance: balance.balance,
    }));
    return [...optionsInput, ...itemsArray];
  }, [additionalAssets]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: 0,
    },
  });

  const getFieldStateSelect = watch('select') || 'LLD';

  const validate = (value) => {
    if (Number.isNaN(Number(value))) return 'Not a number';

    const itemData = options.find((item) => item.value === getFieldStateSelect);
    const { index, decimals, balance } = itemData;
    if (Number(index) < 0) {
      if (index === IndexHelper.POLITIPOOL_LLM) {
        return Validator.validateMeritsValue(politipoolLlm, value);
      }
      return Validator.validateDollarsValue(maxUnbond, value);
    }
    return Validator.validateValue(
      typeof balance === 'string' ? new BN(balance.slice(2), 16) : new BN(balance),
      parseAssets(value, decimals),
    );
  };

  return (
    <form
      className={cx(styles.getCitizenshipModal, styles.transferWithRemarkWidth)}
      onSubmit={handleSubmit(((value) => {
        if (!isValid) return;
        submit(value, options);
      }))}
    >
      <div className={styles.h3}>
        Spend
        {' '}
        {getFieldStateSelect}
        {' '}
        with remark
      </div>
      <div className={styles.description}>
        You are going to spend
        {' '}
        {getFieldStateSelect}
        {' '}
        with remark
      </div>

      <div>
        <div className={styles.title}>
          Transfer
          <SelectInput
            register={register}
            options={options}
            name="select"
            selected="LLD"
            onChange={(value) => {
              setValue('select', value);
              trigger('transfer');
            }}
          />
        </div>

        <div className={styles.title}>Amount</div>
        <TextInput
          register={register}
          name="transfer"
          errorTitle="Amount"
          placeholder="Amount"
          require
          validate={validate}
        />
        {errors?.transfer
            && <div className={styles.error}>{errors.transfer.message}</div>}

        <div className={styles.title}>Recipient</div>
        <InputSearch
          errorTitle="Recipient"
          register={register}
          name="recipient"
          placeholder="Recipient"
          isRequired
          trigger={trigger}
          setValue={setValue}
          validate={(v) => {
            if (!isValidSubstrateAddress(v)) return 'Invalid Address';
            return true;
          }}
        />
        {errors.recipient?.message
          && <div className={styles.error}>{errors.recipient.message}</div>}

        {userRemark ? (
          <RemarkFormUser
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        ) : (
          <RemarkForm
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        )}
      </div>

      <div className={styles.buttonWrapper}>
        <Button className={styles.button} medium onClick={closeModal}>
          Cancel
        </Button>
        <Button className={styles.button} medium primary type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}

TransferWithRemarkModal.defaultProps = {
  userRemark: false,
};

TransferWithRemarkModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  userRemark: PropTypes.bool,
  submit: PropTypes.func.isRequired,
  additionalAssets: PropTypes.arrayOf(PropTypes.shape({
    metadata: {
      symbol: PropTypes.string,
      name: PropTypes.string,
      decimals: PropTypes.number,
    },
    balance: {
      balance: PropTypes.number,
    },
  })),
  maxUnbond: PropTypes.number.isRequired,
  politipoolLlm: PropTypes.number.isRequired,
};

function TransferWithRemarkModalWrapper(props) {
  return (
    <ModalRoot>
      <TransferWithRemarkModal {...props} />
    </ModalRoot>
  );
}

export default TransferWithRemarkModalWrapper;
