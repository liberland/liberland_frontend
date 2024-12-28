import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import { encodeRemark } from '../../../api/nodeRpcCall';

const remarkOptions = {
  category: [
    {
      value: 'marketingAndPr',
      label: 'Marketing and PR',
      index: 0,
    },
    {
      value: 'diplomacy',
      label: 'Diplomacy',
      index: 1,
    },
    {
      value: 'it',
      label: 'It',
      index: 2,
    },
    {
      value: 'legal',
      label: 'Legal',
      index: 3,
    },
    {
      value: 'administration',
      label: 'Administration',
      index: 4,
    },
    {
      value: 'settlement',
      label: 'Settlement',
      index: 5,
    },
    {
      value: 'other',
      label: 'Other',
      index: 6,
    },
  ],
};

export default function RemarkForm({
  index,
  form,
}) {
  const getName = useCallback((name) => (
    typeof index === 'number' ? [index, name] : name
  ), [index]);
  const [
    category,
    project,
    supplier,
    description,
    amountInUsd,
    finalDestination,
  ] = Form.useWatch([
    getName('category'),
    getName('project'),
    getName('supplier'),
    getName('description'),
    getName('amountInUsd'),
    getName('finalDestination'),
  ], form);
  useEffect(() => {
    (async () => {
      const remark = {
        category,
        project,
        supplier,
        description,
        finalDestination,
        amountInUSDAtDateOfPayment: Number(amountInUsd),
      };
      const encoded = await encodeRemark(remark);
      form.setFieldValue(getName('combined'), encoded);
    })();
  }, [
    category,
    project,
    supplier,
    description,
    amountInUsd,
    finalDestination,
    form,
    getName,
  ]);
  return (
    <>
      <Form.Item
        name={getName('category')}
        label="Category"
        rules={[{ required: true }]}
        initialValue={remarkOptions[0].value}
      >
        <Select
          options={remarkOptions}
          defaultActiveFirstOption
        />
      </Form.Item>
      <Form.Item
        name={getName('project')}
        label="Project"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={getName('supplier')}
        label="Supplier"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={getName('description')}
        label="Description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={getName('finalDestination')}
        label="Final destination"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Amount in USD at date of payment"
        name={getName('amountInUsd')}
        rules={[{ required: true }]}
      >
        <InputNumber controls={false} />
      </Form.Item>
      <Form.Item
        hidden
        name={getName('combined')}
      >
        <Input />
      </Form.Item>
    </>
  );
}

RemarkForm.propTypes = {
  index: PropTypes.number,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
