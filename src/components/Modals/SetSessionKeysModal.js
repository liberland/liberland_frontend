import React from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import PropTypes from 'prop-types';
import { isHex } from '@polkadot/util';
import Button from '../Button/Button';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';

function SetSessionKeysForm({
  onSubmit, onClose,
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmit(values);
        onClose();
      }}
    >
      <Title level={3}>Change session keys</Title>
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
              return v.length === 258 ? Promise.resolve() : Promise.reject('Invalid length');
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
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
          Change session keys
        </Button>
      </Flex>
    </Form>
  );
}

SetSessionKeysForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Change session keys" {...props} />
  );
}

const ProposeBudgetModal = modalWrapper(SetSessionKeysForm, ButtonModal);

export default ProposeBudgetModal;
