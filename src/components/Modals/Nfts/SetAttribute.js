import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';
import OpenModalButton from '../components/OpenModalButton';
import modalWrapper from '../components/ModalWrapper';

function SetAttributeForm({ onClose, collectionId, itemId }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const submitAttribute = async (values) => {
    const { namespace, key, value } = values;
    dispatch(nftsActions.setAttributesNft.call({
      collectionId, itemId, namespace, key, value, walletAddress,
    }));
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={submitAttribute}>
      <Title level={3}>Set NFT Attribute</Title>
      <Paragraph>
        Fill in the details below to set a new attribute for your NFT.
      </Paragraph>
      <Form.Item label="Namespace" name="namespace" rules={[{ required: true }]}>
        <Select
          options={[
            {
              label: 'Collection owner',
              value: 'collectionowner',
            },
            {
              label: 'Item Owner',
              value: 'itemowner',
            },
            {
              label: 'Account',
              value: 'account',
            },
          ]}
          placeholder="Select namespace"
        />
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[{ required: true }]}>
        <Input placeholder="Enter key for attribute" />
      </Form.Item>
      <Form.Item label="Value" name="value" rules={[{ required: true }]}>
        <Input placeholder="Enter value for attribute" />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button primary type="submit">
          Set Attribute
        </Button>
      </Flex>
    </Form>
  );
}

SetAttributeForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
};

function ButtonModal(props) {
  return <OpenModalButton primary text="Set Attribute" {...props} />;
}

const SetAttributeModal = modalWrapper(SetAttributeForm, ButtonModal);

export default SetAttributeModal;
