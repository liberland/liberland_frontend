import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { mintAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { isValidSubstrateAddress } from '../../../../utils/walletHelpers';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';

function MintAssetForm({ assetId, onClose }) {
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
  });

  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const onSubmit = async ({
    amount,
    beneficiary,
  }) => {
    try {
      await mintAsset({
        amount,
        beneficiary,
        id: assetId,
        owner: userWalletAddress,
      });
      dispatch(walletActions.getAdditionalAssets.call());
    } catch (e) {
      setError('amount', { message: 'Something went wrong' });
    }
  };

  const amount = watch('amount', '');

  const validateAddress = (v) => (
    !isValidSubstrateAddress(v)
      ? 'Invalid Address'
      : undefined
  );

  if (!userWalletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <div className={styles.asset}>
        <label className={styles.wrapper}>
          Mint amount
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="amount"
              errorTitle="Amount"
              value={amount}
              className={styles.input}
              onChange={(event) => setValue('amount', event.target.value)}
              disabled={isSubmitting}
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
              Assets minted successfully
            </div>
          )}
        </label>
        <label className={styles.wrapper} htmlFor="beneficiary">
          Beneficiary account
          <div className={styles.inputWrapper}>
            <InputSearch
              id="beneficiary"
              errorTitle="Beneficiary account"
              register={register}
              name="beneficiary"
              placeholder="Beneficiary"
              isRequired
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
            />
          </div>
          {errors.beneficiary && (
            <div className={styles.error}>
              {errors.beneficiary.message}
            </div>
          )}
        </label>
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
            Mint assets
          </Button>
        </div>
      </div>
    </form>
  );
}

MintAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assetId: PropTypes.number.isRequired,
};

function MintAssetFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div>
      <Button primary medium onClick={() => setShow(true)}>
        Mint asset
      </Button>
      {show && (
        <ModalRoot>
          <MintAssetForm
            {...props}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

MintAssetFormModalWrapper.propTypes = {
  assetId: PropTypes.number.isRequired,
};

export default MintAssetFormModalWrapper;
