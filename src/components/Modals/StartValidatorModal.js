import React from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Checkbox from 'antd/es/checkbox';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { BN, isHex } from '@polkadot/util';
import Divider from 'antd/es/divider';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function StartValidatorForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    const commission = (new BN(values.commission)).mul(new BN(10000000));
    const blocked = !values.allow_nominations;
    dispatch(validatorActions.validate.call({ commission, blocked, keys: values.keys }));
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        commission: 20,
        allow_nominations: true,
      }}
      onFinish={onSubmit}
    >
      <Title level={3}>Start validator</Title>

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
      <Form.Item
        label="Session keys"
        name="keys"
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (!isHex(v)) {
                return Promise.reject('Must be a hex string starting with 0x');
              }
              return v.length === 258
                ? Promise.resolve()
                : Promise.reject('Invalid length');
            },
          },
        ]}
      >
        <Input />
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
          Start validator
        </Button>
      </Flex>
    </Form>
  );
}

StartValidatorForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  const { label } = props;
  return (
    <OpenModalButton primary text={label} {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
};

const StartValidatorModal = modalWrapper(StartValidatorForm, ButtonModal);

export default StartValidatorModal;
