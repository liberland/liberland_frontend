/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function DateInput({
  register,
  name,
  placeholder,
  required = false,
  width = 350,
  error,
  errorTitle,
  withIcon = false,
  Icon,
  value,
  disabled = false,
}) {
  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <input
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
        type="date"
        name={name}
        placeholder={placeholder}
        width={width}
        error={error}
        value={value}
        disabled={disabled}
        {...register(name, {
          required: required && `${errorTitle} is required`,
        })}
      />
    </div>
  );
}

export default DateInput;
