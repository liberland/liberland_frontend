/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import cx from 'classnames';

import { ReactComponent as PasswordEye } from '../../assets/icons/password-eye.svg';
// import passwordEyeShow from '../../assets/icons/password-eye-show.svg';

import styles from './styles.module.scss';

function PasswordInput({
  register,
  name,
  placeholder,
  required = false,
  pattern = false,
  validate = false,
  error = false,
  width = 350,
  withIcon = false,
  Icon,
}) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <input
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        {...register(name, {
          pattern,
          validate,
          required: required && 'This field is required',
        })}
        show={show}
        error={error}
        width={width}
      />
      <div />
      <PasswordEye onClick={handleShow} className={styles.passwordEye} />
    </div>
  );
}

export default PasswordInput;
