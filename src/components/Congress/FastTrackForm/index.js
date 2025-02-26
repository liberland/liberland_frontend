import React from 'react';
import Form from 'antd/es/form';
import PropTypes from 'prop-types';
import Checkbox from 'antd/es/checkbox';
import Collapse from 'antd/es/collapse';
import Divider from 'antd/es/divider';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

export const FastTrackDefaults = {
  fastTrack: false,
  fastTrackVotingPeriod: 3,
  fastTrackEnactmentPeriod: 1,
};

export default function FastTrackForm({ form }) {
  const fastTrack = Form.useWatch('fastTrack', form);
  return (
    <>
      <Form.Item
        name="fastTrack"
        valuePropName="checked"
        label="Fast track proposal"
        layout="horizontal"
      >
        <Checkbox />
      </Form.Item>
      <Collapse
        collapsible="icon"
        activeKey={fastTrack ? ['fastTrack'] : []}
        onChange={() => form.setFieldValue('fastTrack', !fastTrack)}
        items={[
          {
            key: 'fastTrack',
            label: 'Fast track proposal',
            children: (
              <>
                <Title level={4}>
                  Referendum period
                </Title>
                <Paragraph>
                  How long should voting take, specified in days, minimum 3 days.
                </Paragraph>
                <Form.Item
                  name="fastTrackVotingPeriod"
                  label="Referendum period"
                  rules={[
                    { required: true },
                  ]}
                >
                  <InputNumber controls={false} min={3} />
                </Form.Item>
                <Form.Item
                  name="fastTrackEnactmentPeriod"
                  label="Enactment period"
                  rules={[
                    { required: true },
                  ]}
                  extra="Delay between referendum end and its execution, specified in days."
                >
                  <InputNumber controls={false} min={0} />
                </Form.Item>
              </>
            ),
          },
        ]}
      />
      <Divider />
    </>
  );
}

FastTrackForm.propTypes = {
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
