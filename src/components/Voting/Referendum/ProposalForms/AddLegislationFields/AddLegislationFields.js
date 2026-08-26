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

  // Autosplit driven by a real click instead of a clipboard event. Programmatic
  // callers (automation, assistive tooling) set field values without firing a
  // DOM paste, so onPaste never runs for them and a whole document would stay
  // crammed into one section. Re-splitting the joined content is equivalent to
  // what a human paste produces, and never discards text.
  const handleSplitIntoSections = () => {
    const joined = sections.map((section) => section?.value || '').join('\n\n').trim();
    if (!joined) return;
    const newSections = markdown2sections(joined);
    if (newSections.length > 1) {
      form.setFieldValue('sections', newSections.map((value) => ({ value })));
    }
  };

  return (
    <Form.List
      name="sections"
    >
      {(fields, { add, remove }) => (
        <>
          <Flex wrap gap="15px" align="center" justify="space-between">
            <Title level={4}>
              Legislation Content
              {fields.length > 0 && ` — ${fields.length} section${fields.length === 1 ? '' : 's'}`}
            </Title>
            <Flex justify="end" gap="10px" wrap>
              <Button
                onClick={handleSplitIntoSections}
                aria-label="Split legislation content into sections by markdown heading"
                data-testid="legislation-split-sections"
              >
                Split into sections
              </Button>
              <Button
                green
                onClick={add}
                aria-label="Add an empty legislation section"
                data-testid="legislation-add-section"
              >
                Add
              </Button>
            </Flex>
          </Flex>
          {fields.map((field, index) => (
            <div key={field.key} data-testid={`legislation-section-${index + 1}`}>
              <Form.Item
                name={[index, 'value']}
                label={`Section #${index + 1}`}
                rules={[{ required: true }]}
              >
                <TextArea
                  onPaste={handlePaste}
                  placeholder="Paste markdown here, then use 'Split into sections'"
                  aria-label={`Legislation section #${index + 1} content`}
                  data-testid={`legislation-section-input-${index + 1}`}
                />
              </Form.Item>
              {index !== 0 && (
                <Button
                  red
                  onClick={() => remove(field.name)}
                  aria-label={`Delete legislation section #${index + 1}`}
                  data-testid={`legislation-delete-section-${index + 1}`}
                >
                  Delete
                </Button>
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
