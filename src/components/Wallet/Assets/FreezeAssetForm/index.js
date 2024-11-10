import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { freezeAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import { isValidSubstrateAddress } from '../../../../utils/walletHelpers';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';

function FreezeAssetForm({ assetId, onClose }) {
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
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

  const onSubmit = async ({
    frozen,
  }) => {
    try {
      await freezeAsset({
        frozen,
        id: assetId,
        owner: userWalletAddress,
      });
      dispatch(walletActions.getAdditionalAssets.call());
    } catch (e) {
      setError('frozen', { message: 'Something went wrong' });
    }
  };

  const validateAddress = (v) => (
    !isValidSubstrateAddress(v)
      ? 'Invalid Address'
      : undefined
  );

  const frozen = watch('frozen', '');

  if (!userWalletAddress || !additionalAssets) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <div className={styles.asset}>
        <label className={styles.wrapper} htmlFor="frozen">
          Account to freeze (optional)
          <div className={styles.inputWrapper}>
            <InputSearch
              id="frozen"
              errorTitle="Frozen account"
              register={register}
              name="frozen"
              placeholder="frozen"
              trigger={trigger}
              setValue={setValue}
              validate={validateAddress}
            />
          </div>
          {errors.frozen && (
            <div className={styles.error}>
              {errors.frozen.message}
            </div>
          )}
          {isSubmitSuccessful && (
            <div className={styles.success}>
              Asset frozen successfully
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
            {frozen ? (
              <>
                Freeze asset for
                {' '}
                {frozen.slice(0, 5)}
                ...
              </>
            ) : (
              'Freeze asset'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

FreezeAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assetId: PropTypes.number.isRequired,
};

function FreezeAssetFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div>
      <Button primary medium onClick={() => setShow(true)}>
        Freeze asset
      </Button>
      {show && (
        <ModalRoot>
          <FreezeAssetForm
            {...props}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

FreezeAssetFormModalWrapper.propTypes = {
  assetId: PropTypes.number.isRequired,
};

export default FreezeAssetFormModalWrapper;
