// LIBS
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import stylesSelect from '../Home/ChangeWallet/styles.module.scss';
import { TextInput } from '../InputComponents';

function FillNumber({
  closeModal, textData, onAccept, higherThanZero, itemList,
}) {
  const {
    nft,
    collection,
    title = 'Set price of NFT',
    description = `You are going to set price nft ${nft.name || ''}  (${nft.nftId})
     of collection ${collection.name || ''} (${collection.collectionId}) to...`,
    submitButtonText = 'Make transfer',
    amount = null,
  } = textData;

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    trigger,
  } = useForm({
    mode: 'all',
    defaultValues: {
      amount,
    },
  });

  const formSubmit = async (data) => {
    if (!isValid || Number.isNaN(data?.amount)) return null;
    if (itemList) {
      await onAccept(data.collection, data.amount);
    } else {
      await onAccept(data.amount);
    }
    return true;
  };

  useEffect(() => {
    if (amount) {
      trigger('amount');
    }
  }, [amount, trigger]);

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(formSubmit)}>
      <div className={styles.h3}>
        {title}
      </div>
      <div className={styles.description}>
        {description}
      </div>

      {itemList && (
        <>
          <label htmlFor="collection">Choose a Collection</label>
          <br />
          <br />
          {itemList.length > 0 ? (
            <div className={stylesSelect.selectWrapper}>
              <select
                className={stylesSelect.select}
                id="collection"
                {...register('collection', { required: 'Please choose a collection' })}
              >
                <option value="">Select a collection</option>
                {itemList.map((item) => {
                  const { collectionId } = item;
                  return (
                    <option key={collectionId} value={collectionId}>
                      {collectionId}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : <div>First you need to create collection</div>}
          {errors?.collection?.message && (
          <div className={styles.error}>{errors.collection.message}</div>
          )}
        </>
      )}
      <br />

      <TextInput
        errorTitle="Amount"
        register={register}
        validate={(value) => {
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(value)) {
            return 'Amount must be a number';
          }
          const numValue = parseFloat(value);
          if (higherThanZero && numValue <= 0) {
            return 'Amount must be greater than zero';
          }
          return true;
        }}
        name="amount"
        placeholder="Amount"
        required
      />
      {errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div>}

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

FillNumber.defaultProps = {
  textData: {
    title: 'Transfer to',
    description: 'You are going to transfer nft to...',
    submitButtonText: 'Make transfer',
    nft: null,
    collection: null,
    amount: null,
  },
  higherThanZero: true,
  itemList: null,
};

FillNumber.propTypes = {
  onAccept: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  higherThanZero: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.array,
  textData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    submitButtonText: PropTypes.string,
    amount: PropTypes.number,
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

function FillNumberWrapper(props) {
  return (
    <ModalRoot>
      <FillNumber {...props} />
    </ModalRoot>
  );
}

export default FillNumberWrapper;
