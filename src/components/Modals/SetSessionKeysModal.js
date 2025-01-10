import React, { useState } from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import PropTypes from 'prop-types';
import { isHex } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';

function SetSessionKeysModal({
  onSubmit, closeModal,
}) {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Title level={3}>Change session keys</Title>
      <Form.Item
        label="Session keys"
        name="keys"
        rules={[
          { required: true },
          {
            validator: (v) => {
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
          onClick={closeModal}
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

SetSessionKeysModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function SetSessionKeysModalWrapper({
  onSubmit,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        small
        primary
        onClick={() => setShow(true)}
      >
        Change session keys
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <SetSessionKeysModal
            closeModal={() => setShow(false)}
            onSubmit={onSubmit}
          />
        </ModalRoot>
      )}
    </>
  );
}

SetSessionKeysModalWrapper.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
