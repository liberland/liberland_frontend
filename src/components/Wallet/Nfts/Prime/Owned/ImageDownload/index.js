import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import Button from '../../../../../Button/Button';
import { downloadImage } from '../../Mining/utils';
import styles from './styles.module.scss';

function ImageDownload({
  imageRefs,
  id,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      await downloadImage(id, imageRefs.current[id]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button primary onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Download'}
      <Space />
      <DownloadOutlined className={styles.icon} />
    </Button>
  );
}

ImageDownload.propTypes = {
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  imageRefs: PropTypes.object.isRequired,
};

export default ImageDownload;
