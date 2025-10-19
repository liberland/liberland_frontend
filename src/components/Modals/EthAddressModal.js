import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Button from '../Button/Button';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';
import EthereumSelectorWallet from './components/EthereumSelectorWallet';

function EthAddressModalForm({
  onClose,
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onClose}
    >
      <Title level={3}>Connect Your Wallet</Title>
      <Paragraph>
        Choose your preferred Ethereum wallet
      </Paragraph>
      <Divider />
      <EthereumSelectorWallet />
      <Divider />
      <Flex wrap gap="15px">
        <Button
          primary
          type="submit"
        >
          Done
        </Button>
      </Flex>
    </Form>
  );
}

EthAddressModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Ethereum account" {...props} />
  );
}
const EthAddressModal = modalWrapper(EthAddressModalForm, ButtonModal);

export default EthAddressModal;
