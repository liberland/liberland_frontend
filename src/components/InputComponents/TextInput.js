import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const TextInput = ({
  register,
  name,
  placeholder,
  required = false,
  pattern = false,
  validate = false,
  width = 350,
  error,
  errorTitle,
  withIcon = false,
  Icon,
}) => (
  <div className={styles.inputWrapper}>
    {Icon && <Icon className={styles.inputIcon} />}
    <input
      className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
      name={name}
      placeholder={placeholder}
      width={width}
      error={error}
      ref={register({
        validate,
        pattern,
        required: required && `${errorTitle} is required`,
      })}
    />
    <div />
  </div>
);

export default TextInput;
