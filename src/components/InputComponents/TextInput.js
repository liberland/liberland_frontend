/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function TextInput({
  register,
  name,
  placeholder,
  required = false,
  pattern = false,
  validate = false,
  width = 350,
  errorTitle,
  withIcon = false,
  Icon,
  value,
  disabled = false,
  onPaste,
}) {
  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <input
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
        name={name}
        placeholder={placeholder}
        width={width}
        value={value}
        disabled={disabled}
        onPaste={onPaste}
        {...register(name, {
          validate,
          pattern,
          required: required && `${errorTitle} is required`,
        })}
      />
      <div />
    </div>
  );
}

export default TextInput;
