/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const CheckboxInput = ({
  register,
  name,
  required = false,
  errorTitle,
  label,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => setIsChecked(!isChecked);

  return (
    <div className={styles.checkboxInputWrapper}>
      <input
        className={cx(styles.hiddenInput)}
        checked={isChecked}
        type="checkbox"
        {...register(name, { required: required && `${errorTitle} is required` })}
        name={name}
        readOnly
      />
      <div className={cx(styles.checkbox)} checked={isChecked} onClick={handleCheck}>
        <svg className={cx(styles.checkboxIcon, { [styles.checkboxIconHidden]: !isChecked })} viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className={styles.checkboxLabel}>{label}</span>
    </div>
  );
};

export default CheckboxInput;
