import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import stylesModal from '../styles.module.scss';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { TextInput } from '../../InputComponents';
import { blockchainSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';
import stylesSelect from '../../Home/ChangeWallet/styles.module.scss';

function SetAttributeModal({ closeModal, collectionId, itemId }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const submitAttribute = async (values) => {
    if (!isValid) return;
    const { namespace, key, value } = values;

    dispatch(nftsActions.setAttributesNft.call({
      collectionId, itemId, namespace, key, value, walletAddress,
    }));
  };

  return (
    <form className={stylesModal.getCitizenshipModal} onSubmit={handleSubmit(submitAttribute)}>
      <div className={stylesModal.h3}>Set NFT Attribute</div>
      <div className={stylesModal.description}>
        Fill in the details below to set a new attribute for your NFT.
      </div>

      <div className={stylesModal.title}>Namespace</div>
      <div className={stylesSelect.selectWrapper}>
        <select
          {...register('namespace', { required: 'Namespace is required' })}
          className={stylesSelect.select}
        >
          <option value="">Select Namespace</option>
          <option value="collectionowner">Collection Owner</option>
          <option value="itemowner">Item Owner</option>
          <option value="account">Account</option>
        </select>
      </div>

      {errors?.namespace && (
        <div className={stylesModal.error}>{errors.namespace.message}</div>
      )}

      <div className={stylesModal.title}>Key</div>
      <TextInput
        register={register}
        name="key"
        errorTitle="Key"
        placeholder="Enter key for attribute"
        required
      />
      {errors?.key && (
        <div className={stylesModal.error}>{errors.key.message}</div>
      )}

      <div className={stylesModal.title}>Value</div>
      <TextInput
        register={register}
        name="value"
        errorTitle="Value"
        placeholder="Enter value for attribute"
        required
      />
      {errors?.value && (
        <div className={stylesModal.error}>{errors.value.message}</div>
      )}

      <div className={stylesModal.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Set Attribute
        </Button>
      </div>
    </form>
  );
}

SetAttributeModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
};

function SetAttributeModalWrapper(props) {
  return (
    <ModalRoot>
      <SetAttributeModal {...props} />
    </ModalRoot>
  );
}

export default SetAttributeModalWrapper;
