import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import stylesModal from '../styles.module.scss';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';

function CreatEditCollectionModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const {
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'all',
  });

  const createCollection = (payload) => {
    if (!isValid) return;
    const config = payload;
    dispatch(nftsActions.createCollection.call({ walletAdmin: walletAddress, config }));
    closeModal();
  };

  return (
    <form className={stylesModal.getCitizenshipModal} onSubmit={handleSubmit(createCollection)}>
      <div className={stylesModal.h3}>
        Create Collection
      </div>

      <div className={stylesModal.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Create
        </Button>
      </div>
    </form>
  );
}

CreatEditCollectionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function CreateEditCollectionModalWrapper(props) {
  return (
    <ModalRoot>
      <CreatEditCollectionModal {...props} />
    </ModalRoot>
  );
}

export default CreateEditCollectionModalWrapper;
