import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { useDispatch } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { parseDollars } from '../../utils/walletHelpers';
import InputSearch from '../InputComponents/InputSearchAddressName';

function TreasurySpendingMotionModal({ closeModal, budget }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmit = ({ transferToAddress, transferAmount }) => {
    dispatch(
      congressActions.congressSendTreasuryLld.call({
        transferToAddress,
        transferAmount: parseDollars(transferAmount),
      }),
    );
    closeModal();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    try {
      const unbondValue = parseDollars(textUnbondValue);
      if (unbondValue.gt(budget) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Title level={3}>Create new spending</Title>
      <Paragraph>
        Here you can create a new motion for LLD spending.
      </Paragraph>
      <Form.Item
        name="transferToAddress"
        label="Recipient address"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        label="Amount"
        name="transferAmount"
        rules={[
          { required: true },
          { validator: validateUnbondValue },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Create
        </Button>
      </Flex>
    </Form>
  );
}

TreasurySpendingMotionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  budget: PropTypes.instanceOf(BN).isRequired,
};

export default function TreasurySpendingMotionModalWrapper({
  budget,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button primary onClick={() => setShow(true)}>
        Propose spend
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <TreasurySpendingMotionModal budget={budget} closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

TreasurySpendingMotionModalWrapper.propTypes = {
  budget: PropTypes.instanceOf(BN).isRequired,
};
