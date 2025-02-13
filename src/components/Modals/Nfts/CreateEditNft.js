import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import Upload from 'antd/es/upload';
import Spin from 'antd/es/spin';
import Select from 'antd/es/select';
import InputNumber from 'antd/es/input-number';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import { nftsActions } from '../../../redux/actions';
import OpenModalButton from '../components/OpenModalButton';
import modalWrapper from '../components/ModalWrapper';

function CreatEditNFTForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userCollections = useSelector(nftsSelectors.userCollections);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(nftsActions.getUserCollections.call(walletAddress));
  }, [dispatch, walletAddress]);

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

  const createNFT = async ({
    name,
    description,
    collectionId,
    itemId,
    imageFile,
  }) => {
    const metadataCID = await uploadMetadataToIPFS(imageFile[0], name, description);
    dispatch(nftsActions.setMetadataNft.call({
      metadataCID, walletAddress, collectionId, itemId,
    }));
    onClose();
  };

  const getFileFromEvent = (eventOrFile) => {
    if (Array.isArray(eventOrFile)) {
      return eventOrFile;
    }
    return eventOrFile?.fileList;
  };

  if (!userCollections) {
    return <Spin />;
  }

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
      <Form.Item name="itemId" label="Item ID" rules={[{ required: true }]}>
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Form.Item name="collectionId" label="Collection ID" rules={[{ required: true }]}>
        <Select
          disabled={!userCollections.length}
          options={userCollections.map(({ collectionId }) => ({
            label: collectionId,
            value: collectionId,
          }))}
          placeholder={userCollections.length ? 'Select collection to add' : 'Create collection for NFT first'}
        />
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
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button primary type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Mint NFT'}
        </Button>
      </Flex>
    </Form>
  );
}

CreatEditNFTForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return <OpenModalButton text="Create NFT" primary {...props} />;
}

const CreateEditNFTModal = modalWrapper(CreatEditNFTForm, ButtonModal);

export default CreateEditNFTModal;
