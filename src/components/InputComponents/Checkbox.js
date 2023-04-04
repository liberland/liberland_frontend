/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function CheckboxInput({
  register,
  name,
  required = false,
  errorTitle,
  label,
  setValue,
  watch,
}) {
  const isChecked = watch(name);

  const handleCheck = () => {
    setValue(name, !isChecked);
  }

  useEffect(() => {
    register(name);
  }, [register, name]);

  return (
    <div className={styles.checkboxInputWrapper}>
      <div className={cx(styles.checkbox)} onClick={handleCheck}>
        <svg className={cx(styles.checkboxIcon, { [styles.checkboxIconHidden]: !isChecked })} viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className={styles.checkboxLabel}>{label}</span>
    </div>
  );
}

export default CheckboxInput;
