import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import MarkdownEditorInternal from '@uiw/react-markdown-editor';
import useToken from 'antd/es/theme/useToken';
import classNames from 'classnames';
import rehypeSanitize from 'rehype-sanitize';
import { concatNameWithPrefix } from '../../utils/form';
import { useModeContext } from '../AntdProvider';

export default function MarkdownEditor({
  label,
  name,
  description,
  required,
  prefix,
}) {
  const [,, classToken] = useToken();
  const fullName = concatNameWithPrefix(name, prefix);
  const form = Form.useFormInstance();
  const value = Form.useWatch(fullName, form);
  const hasError = form.getFieldError().length > 0;
  const { isDarkMode } = useModeContext();

  return (
    <Form.Item
      label={label}
      name={name}
      extra={description}
      required={required}
    >
      <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
        <MarkdownEditorInternal
          name={name}
          value={value}
          minHeight="500px"
          className={classNames(
            'ant-input',
            'ant-input-md',
            'ant-input-outlined',
            classToken,
            { 'ant-input-status-error': hasError },
          )}
          onChange={(v) => form.setFieldValue(fullName, v)}
          visible
          previewProps={{
            rehypePlugins: [rehypeSanitize],
          }}
        />
      </div>
    </Form.Item>
  );
}

MarkdownEditor.propTypes = {
  name: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])).isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.node,
  prefix: PropTypes.string,
  required: PropTypes.bool,
};
