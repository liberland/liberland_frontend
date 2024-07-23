/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function SelectInput({
  register,
  name,
  options,
  width = 350,
  withIcon = false,
  Icon,
  disabled = false,
  selected = '',
  onChange = null,
}) {
  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <select
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon }, styles.select)}
        name={name}
        width={width}
        disabled={disabled}
        {...register(name)}
        onChange={(e) => (onChange ? onChange(e.target.value) : {})}
      >
        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
              selected={option.value === selected}
            >
              {option.display}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

export default SelectInput;
