import React from 'react';
import PropTypes from 'prop-types';
import Tag from 'antd/es/tag';
import styles from './styles.module.scss';

function AllowedDisplay({
  blocked,
}) {
  return blocked ? (
    <Tag className={styles.error} color="white">
      Blocked
    </Tag>
  ) : (
    <Tag className={styles.success} color="white">
      Available
    </Tag>
  );
}

AllowedDisplay.propTypes = {
  blocked: PropTypes.bool,
};

export default AllowedDisplay;
