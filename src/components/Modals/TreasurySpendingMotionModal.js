import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { useDispatch } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { parseDollars } from '../../utils/walletHelpers';
import InputSearch from '../InputComponents/InputSearchAddressName';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function TreasurySpendingMotionForm({ onClose, budget }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmit = ({ transferToAddress, transferAmount }) => {
    dispatch(
      congressActions.congressSendTreasuryLld.call({
        transferToAddress,
        transferAmount: parseDollars(transferAmount),
      }),
    );
    onClose();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    try {
      const unbondValue = parseDollars(textUnbondValue);
      if (unbondValue.gt(budget) || unbondValue.lte(BN_ZERO)) {
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
        <Button medium onClick={onClose}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Create
        </Button>
      </Flex>
    </Form>
  );
}

TreasurySpendingMotionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  budget: PropTypes.instanceOf(BN).isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Propose spend" {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

const TreasurySpendingMotionModal = modalWrapper(TreasurySpendingMotionForm, ButtonModal);

export default TreasurySpendingMotionModal;
