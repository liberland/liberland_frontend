import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';
import { parseDollars, parseMerits } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import { walletSelectors } from '../../redux/selectors';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';

function SendLLDModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = balances?.liquidAmount?.amount !== '0x0' ? BN.max(
    BN_ZERO,
    new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')), // leave at least 2 liquid LLD...
  ) : 0;

  const [form] = Form.useForm();
  const transfer = (values) => {
    dispatch(
      walletActions.sendTransfer.call({
        recipient: values.recipient,
        amount: parseDollars(values.amount),
      }),
    );
    closeModal();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond)) {
        return Promise.reject('Minimum of 2 LLD must remain after transaction');
      }
      if (unbondValue.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={transfer}
    >
      <Title level={3}>Send LLD</Title>
      <Paragraph>
        You are going to send tokens from your wallet
      </Paragraph>
      <Form.Item
        label="Send to address"
        name="recipient"
        rules={[{ required: true }]}
      >
        <InputSearch placeholder="Send to address" />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount LLD"
        rules={[
          { required: true },
          {
            validator: validateUnbondValue,
          },
        ]}
      >
        <InputNumber stringMode controls={false} placeholder="Amount LLD" />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
          Cancel
        </Button>
        <Button primary type="submit">
          Make transfer
        </Button>
      </Flex>
    </Form>
  );
}

SendLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLDModalWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={styles.button} onClick={() => setOpen(true)}>
        Send LLD
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot>
          <SendLLDModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default SendLLDModalWrapper;
