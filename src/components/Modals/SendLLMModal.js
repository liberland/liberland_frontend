import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import { walletSelectors } from '../../redux/selectors';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';

function SendLLMModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const [form] = Form.useForm();

  const transfer = (values) => {
    dispatch(walletActions.sendTransferLLM.call({
      recipient: values.recipient,
      amount: parseMerits(values.amount),
    }));
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
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
    <Form
      onFinish={transfer}
      form={form}
    >
      <Title level={3}>Send LLM</Title>
      <Paragraph>
        You are going to send tokens from your wallet
      </Paragraph>
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
        rules={[
          { required: true },
          { validator: validateUnbondValue },
        ]}
      >
        <InputNumber stringMode controls={false} />
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
          Make transfer
        </Button>
      </Flex>
    </Form>
  );
}

SendLLMModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLMModalWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={styles.button} onClick={() => setOpen(true)}>
        Send LLM
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot>
          <SendLLMModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default SendLLMModalWrapper;
