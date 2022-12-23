/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

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
  setSendAddress,
  value,
  disabled = false,
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
        onInput={(e) => setSendAddress(e.target.value)}
        disabled={disabled}
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

TextInput.propTypes = {
  setSendAddress: PropTypes.func,
};

TextInput.defaultProps = {
  setSendAddress: () => null,
};

export default TextInput;
