import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';

function PayoutStakingModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const payout = () => {
    dispatch(validatorActions.payout.call());
    closeModal();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={payout}
    >
      <Title level={3}>Payout staking rewards</Title>
      <Paragraph>
        Staking rewards are paid per staking era and validator. These payouts will
        be batched 10 at a time, but it&apos;s still possible that your wallet will ask
        you to sign multiple transactions.
      </Paragraph>

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
          Payout
        </Button>
      </Flex>
    </Form>
  );
}

PayoutStakingModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function PayoutStakingModalWrapper() {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Payout rewards
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <PayoutStakingModal closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default PayoutStakingModalWrapper;
