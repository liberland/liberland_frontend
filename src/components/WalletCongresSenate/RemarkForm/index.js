import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import { encodeRemark } from '../../../api/nodeRpcCall';
import { validateFinalDestination } from '../../Modals/utils';

const remarkOptions = [
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
];

export default function RemarkForm({
  prefix,
  index,
  form,
  setIsLoading,
  isCrosschain,
}) {
  const getName = useCallback((name, withPrefix) => {
    const baseName = typeof index === 'number' ? [index, name] : [name];
    if (prefix && withPrefix) {
      baseName.unshift(prefix);
    }
    return baseName.length === 1 ? baseName[0] : baseName;
  }, [prefix, index]);
  const category = Form.useWatch(getName('category', true), form);
  const project = Form.useWatch(getName('project', true), form);
  const supplier = Form.useWatch(getName('supplier', true), form);
  const description = Form.useWatch(getName('description', true), form);
  const amountInUsd = Form.useWatch(getName('amountInUsd', true), form);
  const finalDestination = Form.useWatch(getName('finalDestination', true), form);
  useEffect(() => {
    (async () => {
      if (amountInUsd) {
        try {
          setIsLoading(true);
          const remark = {
            category,
            project,
            supplier,
            description,
            finalDestination,
            amountInUSDAtDateOfPayment: Number(amountInUsd),
          };
          const encoded = await encodeRemark(remark);
          form.setFieldValue(getName('combined', true), encoded);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          form.setFields([{ name: getName('category', true), errors: ['Something went wrong'] }]);
        } finally {
          setIsLoading(false);
        }
      }
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
    setIsLoading,
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
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              if (isCrosschain && !validateFinalDestination(value)) {
                return Promise.reject('Invalid destination format');
              }
              return Promise.resolve();
            },
          },
        ]}
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
  prefix: PropTypes.string,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFields: PropTypes.func.isRequired,
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  isCrosschain: PropTypes.bool,
};
