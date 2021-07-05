import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './styles.module.scss';

const Status = ({
  status, completed, declined, pending, className,
}) => (
  <span
    className={cx(styles.status, className,
      { [styles.completed]: completed, [styles.declined]: declined, [styles.pending]: pending })}
  >
    {status}
  </span>
);

Status.defaultProps = {
  completed: false,
  declined: false,
  pending: false,
  className: '',
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  declined: PropTypes.bool,
  pending: PropTypes.bool,
  className: PropTypes.string,
};

export default Status;
