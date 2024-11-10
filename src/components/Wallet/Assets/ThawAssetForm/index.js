import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { thawAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import { isValidSubstrateAddress } from '../../../../utils/walletHelpers';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';

function ThawAssetForm({ assetId, onClose }) {
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
    thaw,
  }) => {
    try {
      await thawAsset({
        thaw,
        id: assetId,
        owner: userWalletAddress,
      });
      dispatch(walletActions.getAdditionalAssets.call());
    } catch (e) {
      setError('thaw', { message: 'Something went wrong' });
    }
  };

  const validateAddress = (v) => (
    !isValidSubstrateAddress(v)
      ? 'Invalid Address'
      : undefined
  );

  const thaw = watch('thaw', '');

  if (!userWalletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <div className={styles.asset}>
        <label className={styles.wrapper} htmlFor="thaw">
          Account to thaw (optional)
          <div className={styles.inputWrapper}>
            <InputSearch
              id="thaw"
              errorTitle="Thaw account"
              register={register}
              name="thaw"
              placeholder="thaw"
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
            />
          </div>
          {errors.thaw && (
            <div className={styles.error}>
              {errors.thaw.message}
            </div>
          )}
          {isSubmitSuccessful && (
            <div className={styles.success}>
              Asset thawed successfully
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
            {thaw ? (
              <>
                Thaw asset for
                {' '}
                {thaw.slice(0, 5)}
                ...
              </>
            ) : (
              'Thaw asset'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

ThawAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assetId: PropTypes.number.isRequired,
};

function ThawAssetFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div>
      <Button primary medium onClick={() => setShow(true)}>
        Thaw asset
      </Button>
      {show && (
        <ModalRoot>
          <ThawAssetForm
            {...props}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

ThawAssetFormModalWrapper.propTypes = {
  assetId: PropTypes.number.isRequired,
};

export default ThawAssetFormModalWrapper;
