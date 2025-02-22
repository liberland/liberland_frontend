import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function FillAddressForm({
  onClose, textData, onAccept,
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
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
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
          onClick={onClose}
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

FillAddressForm.defaultProps = {
  textData: {
    title: 'Transfer to',
    description: 'You are going to transfer nft to...',
    submitButtonText: 'Make transfer',
    nft: null,
    collection: null,
  },
};

FillAddressForm.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
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

function ButtonModal(props) {
  return <OpenModalButton text="Transfer" primary {...props} />;
}

ButtonModal.propTypes = {
  isMint: PropTypes.bool.isRequired,
};

const FillAddressModal = modalWrapper(FillAddressForm, ButtonModal);

export default FillAddressModal;
