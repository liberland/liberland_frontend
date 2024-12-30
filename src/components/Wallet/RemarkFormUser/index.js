import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Input from 'antd/es/input';
import { encodeRemark } from '../../../api/nodeRpcCall';

export default function RemarkFormUser({
  form,
}) {
  const id = Form.useWatch('id', form);
  const description = Form.useWatch('description', form);

  useEffect(() => {
    (async () => {
      const remark = await encodeRemark({
        id, description,
      });
      form.setFieldValue('combined', remark);
    })();
  }, [id, description, form]);

  return (
    <>
      <Form.Item
        name="id"
        label="ID"
        rules={[{ required: true }]}
      >
        <InputNumber controls={false} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter description" />
      </Form.Item>
      <Form.Item
        hidden
        name="combined"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </>
  );
}

RemarkFormUser.propTypes = {
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
