import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { createAsset, updateAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';

function UpdateOrCreateAssetForm({ onClose, isCreate, assetId }) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    },
  } = useForm({
    mode: 'onChange',
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
  }) => {
    try {
      if (isCreate) {
        const nextId = additionalAssets.map((asset) => asset.index)
          .filter(Boolean)
          .sort((a, b) => b - a)[0] + 1;

        await createAsset({
          id: nextId,
          name,
          symbol,
          decimals,
          minBalance: balance,
          admin: userWalletAddress,
        });
      } else {
        await updateAsset({
          id: assetId,
          decimals,
          name,
          symbol,
        });
      }
      dispatch(walletActions.getAdditionalAssets.call());
    } catch {
      setError('name', { message: 'Something went wrong' });
    }
  };

  const name = watch('name', '');
  const symbol = watch('symbol', '');
  const decimals = watch('decimals', '');
  const balance = watch('balance', '');

  const submitButtonText = isCreate ? 'Create asset' : 'Update asset';

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
              Asset created successfully
            </div>
          )}
        </label>
        <label className={styles.wrapper}>
          Asset symbol
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="symbol"
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

UpdateOrCreateAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  assetId: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.number,
  ]),
};

function UpdateOrCreateAssetFormModalWrapper({
  isCreate, assetId,
}) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        {isCreate ? 'Create asset' : 'Update asset information'}
      </Button>
      {show && (
        <ModalRoot>
          <UpdateOrCreateAssetForm
            assetId={assetId}
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
  assetId: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default UpdateOrCreateAssetFormModalWrapper;
