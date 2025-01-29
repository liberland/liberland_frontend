import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import { walletSelectors } from '../../redux/selectors';
import modalWrapper from './components/ModalWrapper';
import ButtonModalArrow from './components/OpenModalButtonWithArrow';

function SendLLMForm({ onClose }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const [form] = Form.useForm();

  const transfer = (values) => {
    dispatch(
      walletActions.sendTransferLLM.call({
        recipient: values.recipient,
        amount: parseMerits(values.amount),
      }),
    );
    onClose();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
  };

  return (
    <Form onFinish={transfer} form={form} layout="vertical">
      <Title level={3}>Send LLM</Title>
      <Paragraph>You are going to send tokens from your wallet</Paragraph>
      <Form.Item
        name="recipient"
        label="Send to address"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        label="Amount LLM"
        name="amount"
        rules={[{ required: true }, { validator: validateUnbondValue }]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>Cancel</Button>
        <Button primary type="submit">
          Make transfer
        </Button>
      </Flex>
    </Form>
  );
}

SendLLMForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return <ButtonModalArrow text="Send LLM" {...props} />;
}

const SendLLMModal = modalWrapper(SendLLMForm, ButtonModal);

export default SendLLMModal;
