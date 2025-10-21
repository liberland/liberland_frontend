import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import { ethActions } from '../../redux/actions';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';
import EthereumSelectorWallet from './components/EthereumSelectorWallet';

function EthAddressModalForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = ({ selectedWallet }) => {
    dispatch(ethActions.getConnectedEthWallet.call({ walletId: selectedWallet }));
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
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
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Select
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
