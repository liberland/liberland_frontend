import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import Spin from 'antd/es/spin';
import Select from 'antd/es/select';

import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';
import OpenModalButton from '../components/OpenModalButton';
import modalWrapper from '../components/ModalWrapper';
import { useUploader } from '../../../hooks/useUploader';
import Uploader from '../../Uploader';

function CreatEditNFTForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userCollections = useSelector(nftsSelectors.userCollections);
  const {
    uploadImageWithLink,
    uploadMetadataToIPFS,
    setPreviewImage,
    uploading,
    previewImage,
  } = useUploader();

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(nftsActions.getUserCollections.call(walletAddress));
  }, [dispatch, walletAddress]);

  const createNFT = async ({
    collectionId,
  }) => {
    const name = form.getFieldValue('name');
    const description = form.getFieldValue('description');
    const metadataCID = await uploadMetadataToIPFS(
      name,
      description,
      () => {
        form.setFields([
          {
            name: 'imageFile',
            errors: ['Cannot upload image before setting name and description'],
          },
        ]);
      },
    );
    dispatch(nftsActions.setMetadataNft.call({
      metadataCID, walletAddress, collectionId,
    }));
    onClose();
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
      <Uploader
        name="imageFile"
        setPreviewImage={setPreviewImage}
        uploadImageWithLink={uploadImageWithLink}
        previewImage={previewImage}
        uploading={uploading}
      />
      <Paragraph>
        Will ask you to sign 2 transactions
      </Paragraph>
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
