import React from 'react';
import Form from 'antd/es/form';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

function LegislationHeading({ section }) {
  return (
    <>
      <Form.Item name="tier" label="Legislation tier">
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
      <Form.Item
        name="year"
        label="Legislation year"
        getValueProps={(value) => ({ value: value ? dayjs(value) : '' })}
      >
        <DatePicker picker="year" />
      </Form.Item>
      <Form.Item name="index" label="Legislation Index">
        <InputNumber controls={false} />
      </Form.Item>
      {typeof section === 'number' && (
        <Form.Item name="section" label="Legislation section">
          <InputNumber controls={false} />
        </Form.Item>
      )}
    </>
  );
}

LegislationHeading.propTypes = {
  section: PropTypes.number,
};

export default LegislationHeading;
