import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Divider from 'antd/es/divider';
import Title from 'antd/es/typography/Title';
import { TextArea } from '../../../../InputComponents';
import Button from '../../../../Button/Button';
import { markdown2sections } from '../../../../../utils/legislation';

export function AddLegislationFields({
  form,
}) {
  const sections = Form.useWatch('sections', form) || [];

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text');
    const newSections = markdown2sections(data);
    if (sections.length === 1) {
      form.setFieldValue('sections', [...newSections.map((value) => ({ value }))]);
    } else if (newSections.length > 1) {
      // Process the paste event only if there are no existing sections or if there's more than one new section
      form.setFieldValue('sections', [...sections, ...newSections.map((value) => ({ value }))]);
    }
  };

  return (
    <>
      <Title level={4}>Legislation Content</Title>
      <Form.List
        name="sections"
        rules={[{ min: 1 }]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item
                  name={[index, 'value']}
                  label={`Section #${index + 1}`}
                  rules={[{ required: true }]}
                >
                  <TextArea onPaste={handlePaste} />
                </Form.Item>
                <Button nano secondary onClick={() => remove(field.name)}>Delete</Button>
                <Divider />
              </div>
            ))}
            <Button nano secondary onClick={add}>Add</Button>
          </>
        )}
      </Form.List>
    </>
  );
}

AddLegislationFields.propTypes = {
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
