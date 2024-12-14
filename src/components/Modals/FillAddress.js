// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { isValidSubstrateAddress } from '../../utils/walletHelpers';

function FillAddress({
  closeModal, textData, onAccept,
}) {
  const {
    nft,
    collection,
    title = 'Transfer nft',
    description = `You are going to transfer nft ${nft.name}  (${nft.nftId})
     of collection ${collection.name} (${collection.collectionId}) to...`,
    submitButtonText = 'Make transfer',
  } = textData;

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    trigger,
  } = useForm({
    mode: 'all',
  });

  const formSubmit = async (data) => {
    if (!isValid || !data?.recipient) return null;
    await onAccept(data.recipient);
    return true;
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(formSubmit)}>
      <div className={styles.h3}>
        {title}
      </div>
      <div className={styles.description}>
        {description}
      </div>

      <InputSearch
        trigger={trigger}
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Recipient address"
        isRequired
        setValue={setValue}
        validate={(v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        }}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

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
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

FillAddress.defaultProps = {
  textData: {
    title: 'Transfer to',
    description: 'You are going to transfer nft to...',
    submitButtonText: 'Make transfer',
    nft: null,
    collection: null,
  },
};

FillAddress.propTypes = {
  onAccept: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  textData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    submitButtonText: PropTypes.string,
    nft: PropTypes.shape({
      nftId: PropTypes.string,
      name: PropTypes.string,
    }),
    collection: PropTypes.shape({
      collectionId: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

function FillAddressWrapper(props) {
  return (
    <ModalRoot>
      <FillAddress {...props} />
    </ModalRoot>
  );
}

export default FillAddressWrapper;
