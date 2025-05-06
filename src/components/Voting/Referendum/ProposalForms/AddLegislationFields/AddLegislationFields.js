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
    e.preventDefault();
    const data = e.clipboardData.getData('text');
    const newSections = markdown2sections(data).map((value) => ({ value }));
    const lastIndex = (sections || []).length - 1;
    if (lastIndex === -1) {
      form.setFieldValue('sections', newSections);
    } else {
      form.setFieldValue('sections', [...sections.slice(0, lastIndex), ...newSections]);
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
          {fields.map((field, index, all) => (
            <div key={field.key}>
              <Form.Item
                name={[index, 'value']}
                label={`Section #${index + 1}`}
                rules={[{ required: true }]}
              >
                <TextArea onPaste={handlePaste} placeholder="Paste markdown to autosplit sections" />
              </Form.Item>
              {all.length > 1 && (
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
