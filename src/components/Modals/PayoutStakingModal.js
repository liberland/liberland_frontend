import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function PayoutStakingForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const payout = () => {
    dispatch(validatorActions.payout.call());
    onClose();
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
          onClick={onClose}
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

PayoutStakingForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Payout rewards" {...props} />
  );
}
const PayoutStakingModal = modalWrapper(PayoutStakingForm, ButtonModal);

export default PayoutStakingModal;
