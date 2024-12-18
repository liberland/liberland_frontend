import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { createOrUpdateAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { isValidSubstrateAddress } from '../../../../utils/walletHelpers';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';

function UpdateOrCreateAssetForm({ onClose, isCreate, defaultValues }) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    trigger,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    },
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

  const onSubmit = async ({
    name,
    symbol,
    decimals,
    balance,
    admin,
    issuer,
    freezer,
  }) => {
    try {
      const nextId = isCreate ? (
        additionalAssets.map((asset) => asset.index)
          .filter(Boolean)
          .sort((a, b) => b - a)[0] + 1
      ) : defaultValues.id;

      await createOrUpdateAsset({
        id: nextId,
        name,
        symbol,
        decimals,
        minBalance: balance,
        admin,
        issuer,
        freezer,
        owner: userWalletAddress,
        isCreate,
        defaultValues,
      });
      dispatch(walletActions.getAdditionalAssets.call());
    } catch {
      setError('name', { message: 'Something went wrong' });
    }
  };

  const name = watch('name', '');
  const symbol = watch('symbol', '');
  const decimals = watch('decimals', '');
  const balance = watch('balance', '');

  const submitButtonText = isCreate ? 'Create asset (~200 LLD)' : 'Update asset';

  const validateAddress = (v) => (
    !isValidSubstrateAddress(v)
      ? 'Invalid Address'
      : undefined
  );

  if (!userWalletAddress || !additionalAssets) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <div className={styles.asset}>
        <label className={styles.wrapper}>
          Asset name
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              minLength={{
                value: 3,
                message: 'Name must be longer than 2 characters',
              }}
              name="name"
              errorTitle="Name"
              value={name}
              className={styles.input}
              onChange={(event) => setValue('name', event.target.value)}
              disabled={isSubmitting}
              placeholder="Name"
              required
            />
          </div>
          {errors.name && (
            <div className={styles.error}>
              {errors.name.message}
            </div>
          )}
          {isSubmitSuccessful && (
            <div className={styles.success}>
              Asset
              {' '}
              {isCreate ? 'created' : 'updated'}
              {' '}
              successfully
            </div>
          )}
        </label>
        <label className={styles.wrapper}>
          Asset symbol
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="symbol"
              minLength={{
                value: 3,
                message: 'Symbol must be longer than 2 characters',
              }}
              errorTitle="Symbol"
              value={symbol}
              className={styles.input}
              onChange={(event) => setValue('symbol', event.target.value)}
              disabled={isSubmitting}
              placeholder="Symbol"
              required
            />
          </div>
          {errors.symbol && (
            <div className={styles.error}>
              {errors.symbol.message}
            </div>
          )}
        </label>
      </div>
      <div className={styles.asset}>
        <label className={styles.wrapper}>
          Decimals
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="decimals"
              errorTitle="Decimals"
              value={decimals}
              className={styles.input}
              onChange={(event) => setValue('decimals', event.target.value)}
              validate={(input) => (!input || /^\d+$/.test(input) ? undefined : 'Invalid decimals')}
              disabled={isSubmitting}
              placeholder="Decimals"
              required
            />
          </div>
          {errors.decimals && (
            <div className={styles.error}>
              {errors.decimals.message}
            </div>
          )}
        </label>
        {isCreate && (
          <label className={styles.wrapper}>
            Minimal balance
            <div className={styles.inputWrapper}>
              <TextInput
                register={register}
                name="balance"
                errorTitle="Balance"
                value={balance}
                className={styles.input}
                onChange={(event) => setValue('balance', event.target.value)}
                validate={(input) => (!input || /^\d*\.?\d+$/.test(input) ? undefined : 'Invalid balance')}
                disabled={isSubmitting}
                placeholder="Balance"
                required
              />
            </div>
            {errors.balance && (
              <div className={styles.error}>
                {errors.balance.message}
              </div>
            )}
          </label>
        )}
      </div>
      <hr className={styles.divider} />
      <div className={styles.asset}>
        <label className={styles.wrapper} htmlFor="admin">
          Admin account
          <div className={styles.inputWrapper}>
            <InputSearch
              id="admin"
              errorTitle="Admin account"
              register={register}
              name="admin"
              placeholder="Admin"
              isRequired
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
              defaultValue={defaultValues?.admin}
            />
          </div>
          {errors.admin && (
            <div className={styles.error}>
              {errors.admin.message}
            </div>
          )}
        </label>
        <label className={styles.wrapper} htmlFor="issuer">
          Issuer account
          <div className={styles.inputWrapper}>
            <InputSearch
              id="issuer"
              errorTitle="Issuer"
              register={register}
              name="issuer"
              placeholder="Issuer"
              isRequired
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
              defaultValue={defaultValues?.issuer}
            />
          </div>
          {errors.issuer && (
            <div className={styles.error}>
              {errors.issuer.message}
            </div>
          )}
        </label>
        <label className={styles.wrapper} htmlFor="freezer">
          Freezer account
          <div className={styles.inputWrapper}>
            <InputSearch
              id="freezer"
              errorTitle="Freezer"
              register={register}
              name="freezer"
              placeholder="Freezer"
              isRequired
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
              defaultValue={defaultValues?.freezer}
            />
          </div>
          {errors.freezer && (
            <div className={styles.error}>
              {errors.freezer.message}
            </div>
          )}
        </label>
      </div>
      <hr className={styles.divider} />
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={isSubmitting} medium onClick={onClose}>
            Close
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
}

const defaultValues = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  symbol: PropTypes.string,
  decimals: PropTypes.string,
  balance: PropTypes.number,
  admin: PropTypes.string,
  issuer: PropTypes.string,
  freezer: PropTypes.string,
});

UpdateOrCreateAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  defaultValues,
};

function UpdateOrCreateAssetFormModalWrapper({
  isCreate, defaultValues: dV,
}) {
  const [show, setShow] = useState();
  return (
    <div className={isCreate ? styles.modal : undefined}>
      <Button
        primary
        medium
        onClick={() => setShow(true)}
      >
        {isCreate ? 'Create asset' : 'Update'}
      </Button>
      {show && (
        <ModalRoot id="create-or-update">
          <UpdateOrCreateAssetForm
            defaultValues={dV}
            isCreate={isCreate}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

UpdateOrCreateAssetFormModalWrapper.propTypes = {
  isCreate: PropTypes.bool,
  defaultValues,
};

export default UpdateOrCreateAssetFormModalWrapper;
