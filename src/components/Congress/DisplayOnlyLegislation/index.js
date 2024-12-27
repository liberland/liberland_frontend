import React from 'react';
import Form from 'antd/es/form';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';

function DisplayOnlyLegislation({ section }) {
  return (
    <>
      <Form.Item name="tier" label="Legislation tier" rules={[{ required: true }]}>
        <Select
          options={[
            { value: 'Constitution', label: 'Constitution' },
            { value: 'InternationalTreaty', label: 'International Treaty' },
            { value: 'Law', label: 'Law' },
            { value: 'Tier3', label: 'Tier 3' },
            { value: 'Tier4', label: 'Tier 4' },
            { value: 'Tier5', label: 'Tier 5' },
            { value: 'Decision', label: 'Decision' },
          ]}
          disabled
        />
      </Form.Item>
      <Form.Item name="year" label="Legislation year" rules={[{ required: true }]}>
        <DatePicker picker="year" disabled />
      </Form.Item>
      <Form.Item name="index" label="Legislation Index" rules={[{ required: true }]}>
        <InputNumber controls={false} disabled />
      </Form.Item>
      {section !== null && (
        <Form.Item name="section" label="Legislation section" rules={[{ required: true }]}>
          <InputNumber controls={false} disabled />
        </Form.Item>
      )}
    </>
  );
}

DisplayOnlyLegislation.propTypes = {
  section: PropTypes.number.isRequired,
};

export default DisplayOnlyLegislation;
