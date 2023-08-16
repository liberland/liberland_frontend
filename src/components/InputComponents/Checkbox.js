/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import cx from "classnames";

import styles from "./styles.module.scss";

function CheckboxInput({
  register,
  name,
  validate = false,
  label,
}) {
  return (
    <div className={styles.checkboxInputWrapper}>
      <label className={cx(styles.checkbox)}>
        <input
          type="checkbox" 
          {...register(name, {
            validate,
          })}
          />
        <svg
            className={cx(styles.checkboxIcon)}
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
      </label>
      <span className={styles.checkboxLabel}>{label}</span>
    </div>
  );
}

export default CheckboxInput;
