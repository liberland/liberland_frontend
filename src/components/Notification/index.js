import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Notification = ({
  mode,
  text,
  heading,
  onClose,
}) => {
  const classes = useMemo(
    () => [styles.notification, styles[mode]].join(' '),
    [mode],
  );

  return (
    <div onClick={onClose} className={classes}>
      <span className={styles.heading}>{heading}</span>
      <p>{text}</p>
    </div>
  );
};

Notification.propTypes = {
  mode: PropTypes.string,
  text: PropTypes.string,
  heading: PropTypes.string,
  onClose: PropTypes.func,
};

Notification.defaultProps = {
  mode: 'info',
  text: '',
  heading: '',
  onClose: () => null,
};

export default Notification;
