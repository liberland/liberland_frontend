// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { parseAssets, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import InputSearch from '../InputComponents/InputSearchAddressName';

// TODO add validation
function SendAssetModal({ closeModal, assetData }) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    mode: 'all',
  });

  const transfer = (values) => {
    dispatch(walletActions.sendAssetsTransfer.call({
      recipient: values.recipient,
      amount: parseAssets(values.amount, assetData.metadata.decimals),
      assetData,
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>
        Send
        {assetData.metadata.symbol}
      </div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send to address</div>
      <InputSearch
        errorTitle="Recipient"
        isRequired
        placeholder="Send to address"
        name="recipient"
        register={register}
        setValue={setValue}
        validate={((v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        })}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>Amount LLD</div>
      <TextInput
        register={register}
        name="amount"
        placeholder={`Amount ${assetData.metadata.symbol}`}
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Make transfer
        </Button>
      </div>
    </form>
  );
}

SendAssetModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  assetData: PropTypes.any,
};

function SendAssetModalWrapper(props) {
  return (
    <ModalRoot>
      <SendAssetModal {...props} />
    </ModalRoot>
  );
}

export default SendAssetModalWrapper;
