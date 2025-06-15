import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import styles from './styles.module.scss';

function IsConfirmed({ isConfirmed }) {
  return isConfirmed
    ? <CheckCircleFilled className={styles.green} />
    : <CloseCircleFilled className={styles.red} />;
}

IsConfirmed.propTypes = {
  isConfirmed: PropTypes.bool,
};

export default IsConfirmed;
