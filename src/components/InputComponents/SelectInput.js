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
  defaultValue
}) {
  return (
    <div className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <select
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
        name={name}
        width={width}
        disabled={disabled}
        defaultValue={defaultValue}
        {...register(name)}
      >
        {options.map(
          (option) => 
            <option 
              key={option.value}
              value={option.value}
              selected={option.selected}
            >
              {option.display}
            </option>
          )}
      </select>
    </div>
  );
}

export default SelectInput;
