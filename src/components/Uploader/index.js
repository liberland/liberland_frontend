import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Upload from 'antd/es/upload';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import Paragraph from 'antd/es/typography/Paragraph';
import Spin from 'antd/es/spin';
import styles from './styles.module.scss';

const getFileFromEvent = (eventOrFile) => {
  if (Array.isArray(eventOrFile)) {
    return eventOrFile;
  }
  return eventOrFile?.fileList;
};

function Uploader({
  name,
  uploading,
  previewImage,
  setPreviewImage,
  uploadImageWithLink,
  label,
  required,
}) {
  return (
    <Form.Item
      name={name}
      valuePropName="fileList"
      label={label || 'Upload image'}
      rules={required ? [{ required: true }] : undefined}
      getValueFromEvent={getFileFromEvent}
    >
      <Upload.Dragger
        customRequest={async (options) => {
          const ipfsUrl = await uploadImageWithLink(options.file);
          setPreviewImage(ipfsUrl);
          options.onSuccess(ipfsUrl);
        }}
        disabled={uploading}
        maxCount={1}
        multiple={false}
        accept="image/*"
      >
        <Paragraph className="ant-upload-drag-icon">
          {uploading ? <Spin /> : <InboxOutlined />}
        </Paragraph>
        <Paragraph className="ant-upload-text">
          Click or drag file to this area to upload
        </Paragraph>
        {previewImage && (
          <div className={styles.createImageWrapper}>
            <img className={styles.image} src={previewImage} alt="Preview" />
          </div>
        )}
      </Upload.Dragger>
    </Form.Item>
  );
}

Uploader.propTypes = {
  name: PropTypes.string,
  uploading: PropTypes.bool,
  previewImage: PropTypes.string,
  setPreviewImage: PropTypes.func.isRequired,
  uploadImageWithLink: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default Uploader;
