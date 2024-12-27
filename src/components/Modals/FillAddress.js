import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

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

  const [form] = Form.useForm();

  const formSubmit = async (data) => {
    await onAccept(data.recipient);
    closeModal();
  };

  return (
    <Form
      form={form}
      onFinish={formSubmit}
    >
      <Title level={3}>
        {title}
      </Title>
      <Paragraph>
        {description}
      </Paragraph>
      <Form.Item
        name="recipient"
        label="Recipient"
        rules={[{ required: true }]}
      >
        <InputSearch placeholder="Recipient address" />
      </Form.Item>

      <Flex wrap gap="15px">
        <Button
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          {submitButtonText}
        </Button>
      </Flex>
    </Form>
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
  const [show, setShow] = useState();
  return (
    <>
      <Button
        small
        onClick={() => setShow(true)}
        primary
      >
        Transfer
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <FillAddress {...props} closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default FillAddressWrapper;
