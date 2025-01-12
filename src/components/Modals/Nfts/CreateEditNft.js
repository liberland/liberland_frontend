import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import Upload from 'antd/es/upload';
import Spin from 'antd/es/spin';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import { nftsActions } from '../../../redux/actions';

function CreatEditNFTModal({
  closeModal, collectionId, nftId,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [form] = Form.useForm();

  const uploadImageToIPFS = async (file) => {
    setUploading(true);
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
      setUploading(false);
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    setUploading(false);
    return data.IpfsHash;
  };

  const uploadJsonToIPFS = async (json) => {
    setUploading(true);
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
      setUploading(false);
      throw new Error(error.message || 'Failed to upload JSON');
    }

    const data = await response.json();
    setUploading(false);
    return data.IpfsHash;
  };

  const uploadMetadataToIPFS = async (imageFile) => {
    try {
      const name = form.getFieldValue('name');
      const description = form.getFieldValue('description');
      if (!name || !description) {
        form.setFields([
          {
            name: 'imageFile',
            errors: ['Cannot upload image before setting name and description'],
          },
        ]);
      }
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
    const {
      name, description, imageFile,
    } = values;
    const metadataCID = await uploadMetadataToIPFS(imageFile[0], name, description);
    dispatch(nftsActions.setMetadataNft.call({
      collectionId, itemId: nftId, metadataCID, walletAddress,
    }));
    closeModal();
  };

  const getFileFromEvent = (eventOrFile) => {
    if (Array.isArray(eventOrFile)) {
      return eventOrFile;
    }
    return eventOrFile?.fileList;
  };

  return (
    <Form form={form} layout="vertical" onFinish={createNFT}>
      <Title level={3}>
        Create NFT
      </Title>
      <Paragraph>
        Fill out the details to create your NFT.
      </Paragraph>
      <Form.Item name="name" label="NFT name" rules={[{ required: true }]}>
        <Input placeholder="Enter NFT name" />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input placeholder="Enter description" />
      </Form.Item>
      <Form.Item
        name="imageFile"
        valuePropName="fileList"
        label="Upload image"
        rules={[{ required: true }]}
        getValueFromEvent={getFileFromEvent}
      >
        <Upload.Dragger
          action={uploadImageToIPFS}
          disabled={uploading}
          maxCount={1}
          multiple={false}
          accept="image/*"
          previewFile={(file) => {
            if (file) {
              setPreviewImage(URL.createObjectURL(file));
            }
          }}
        >
          <Paragraph className="ant-upload-drag-icon">
            {uploading ? <Spin /> : <InboxOutlined />}
          </Paragraph>
          <Paragraph className="ant-upload-text">
            Click or drag file to this area to upload
          </Paragraph>
        </Upload.Dragger>
        {previewImage && (
          <div className={styles.createImageWrapper}>
            <img className={styles.image} src={previewImage} alt="Preview" />
          </div>
        )}
      </Form.Item>

      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
          Cancel
        </Button>
        <Button primary type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Mint NFT'}
        </Button>
      </Flex>
    </Form>
  );
}

CreatEditNFTModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  nftId: PropTypes.string,
  collectionId: PropTypes.string,
};

function CreateEditNFTModalWrapper({
  collectionId,
  nftId,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        onClick={() => setShow(true)}
        primary
      >
        Create NFT
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CreatEditNFTModal
            closeModal={() => setShow(false)}
            collectionId={collectionId}
            nftId={nftId}
          />
        </ModalRoot>
      )}
    </>
  );
}

CreateEditNFTModalWrapper.propTypes = {
  nftId: PropTypes.string,
  collectionId: PropTypes.string,
};

export default CreateEditNFTModalWrapper;
