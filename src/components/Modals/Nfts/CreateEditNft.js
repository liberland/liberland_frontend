import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import stylesModal from '../styles.module.scss';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { TextInput } from '../../InputComponents';
import { blockchainSelectors } from '../../../redux/selectors';
import stylesNfts from '../../Wallet/Nfts/Overview/styles.module.scss';
import { nftsActions } from '../../../redux/actions';

function CreatEditNFTModal({
  closeModal, collectionId, nftId,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm({
    mode: 'all',
  });

  const uploadImageToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.IpfsHash;
  };

  const uploadJsonToIPFS = async (json) => {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload JSON');
    }

    const data = await response.json();
    return data.IpfsHash;
  };

  const uploadMetadataToIPFS = async (imageFile, name, description) => {
    try {
      setUploading(true);
      const imageCID = await uploadImageToIPFS(imageFile);
      const metadata = {
        name,
        description,
        image: `ipfs://${imageCID}`,
      };
      const metadataCID = await uploadJsonToIPFS(metadata);
      return metadataCID;
    } catch (error) {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const createNFT = async (values) => {
    if (!isValid) return;
    const {
      name, description, imageFile,
    } = values;
    const metadataCID = await uploadMetadataToIPFS(imageFile[0], name, description);
    dispatch(nftsActions.setMetadataNft.call({
      collectionId, itemId: nftId, metadataCID, walletAddress,
    }));
    closeModal();
  };

  return (
    <form className={stylesModal.getCitizenshipModal} onSubmit={handleSubmit(createNFT)}>
      <div className={stylesModal.h3}>
        Create NFT
      </div>
      <div className={stylesModal.description}>
        Fill out the details to create your NFT.
      </div>

      <div className={stylesModal.title}>NFT Name</div>
      <TextInput
        register={register}
        name="name"
        errorTitle="NFT Name"
        placeholder="Enter NFT name"
        required
      />
      {errors?.name?.message && (
        <div className={stylesModal.error}>{errors.name.message}</div>
      )}

      <div className={stylesModal.title}>Description</div>
      <TextInput
        register={register}
        name="description"
        errorTitle="Description"
        placeholder="Enter description"
        required
      />
      {errors?.description?.message && (
        <div className={stylesModal.error}>{errors.description.message}</div>
      )}

      <div className={stylesModal.title}>Upload Image</div>
      {previewImage && (
        <div className={stylesNfts.imageWrapper}>
          <img className={stylesNfts.image} src={previewImage} alt="Preview" />
        </div>
      )}
      <br />
      <input
        type="file"
        accept="image/*"
        {...register('imageFile', { required: true })}
        required
        onChange={handleImageChange}
      />
      {errors?.imageFile?.message && (
        <div className={stylesModal.error}>{errors.imageFile.message}</div>
      )}

      <div className={stylesModal.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Mint NFT'}
        </Button>
      </div>
    </form>
  );
}

CreatEditNFTModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  nftId: PropTypes.string.isRequired,
  collectionId: PropTypes.string.isRequired,
};

function CreateEditNFTModalWrapper(props) {
  return (
    <ModalRoot>
      <CreatEditNFTModal {...props} />
    </ModalRoot>
  );
}

export default CreateEditNFTModalWrapper;
