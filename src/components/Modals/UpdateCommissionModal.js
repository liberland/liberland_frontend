import React from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Checkbox from 'antd/es/checkbox';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { BN } from '@polkadot/util';
import Divider from 'antd/es/divider';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';
import { valueToBN } from '../../utils/walletHelpers';

function UpdateCommissionForm({
  onClose,
  defaultValues,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    const commission = (new BN(values.commission)).mul(new BN(10000000));
    const blocked = !values.allow_nominations;
    dispatch(validatorActions.updateCommission.call({ commission, blocked }));
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        commission: defaultValues.commission
          ? valueToBN(defaultValues.commission).div(new BN(10000000)).toNumber()
          : 20,
        allow_nominations: !defaultValues?.blocked,
      }}
      onFinish={onSubmit}
    >
      <Title level={3}>
        Update commission
      </Title>

      <Form.Item
        label="Reward commission percentage"
        extra="The commission is deducted from all rewards before the remainder is split with nominators."
        rules={[{ required: true }, { type: 'number', min: 0, max: 100 }]}
        name="commission"
      >
        <InputNumber controls={false} />
      </Form.Item>
      <Form.Item
        name="allow_nominations"
        label="Allow new nominations"
        valuePropName="checked"
        layout="horizontal"
      >
        <Checkbox />
      </Form.Item>
      <Divider />
      <Flex wrap gap="15px">
        <Button
          medium
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Update commission
        </Button>
      </Flex>
    </Form>
  );
}

UpdateCommissionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    commission: PropTypes.number,
    blocked: PropTypes.bool,
  }),
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Update commission" {...props} />
  );
}

const UpdateCommissionModal = modalWrapper(UpdateCommissionForm, ButtonModal);

export default UpdateCommissionModal;
