import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Divider from 'antd/es/divider';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
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
    <Form.List
      name="sections"
    >
      {(fields, { add, remove }) => (
        <>
          <Flex wrap gap="15px" align="center" justify="space-between">
            <Title level={4}>Legislation Content</Title>
            <Flex justify="end">
              <Button green onClick={add}>Add</Button>
            </Flex>
          </Flex>
          {fields.map((field, index) => (
            <div key={field.key}>
              <Form.Item
                name={[index, 'value']}
                label={`Section #${index + 1}`}
                rules={[{ required: true }]}
              >
                <TextArea onPaste={handlePaste} placeholder="Paste markdown to autosplit sections" />
              </Form.Item>
              {index !== 0 && (
                <Button red onClick={() => remove(field.name)}>Delete</Button>
              )}
              <Divider />
            </div>
          ))}
        </>
      )}
    </Form.List>
  );
}

AddLegislationFields.propTypes = {
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
