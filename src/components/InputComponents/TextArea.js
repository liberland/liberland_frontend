/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function TextArea({
  register,
  watch,
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
  const ref = useRef(null);
  const v = watch ? watch(name) : null;

  useEffect(() => {
    if (!ref.current || v === null) return;
    const textarea = ref.current.querySelector('textarea');
    const oldHeight = parseInt(textarea.style.height);
    textarea.style.height = 'inherit';
    const newHeight = Math.max(textarea.scrollHeight, Number.isNaN(oldHeight) ? 0 : oldHeight);
    textarea.style.height = `${newHeight}px`;
  }, [ref.current, v]);

  return (
    <div ref={ref} className={styles.inputWrapper}>
      {Icon && <Icon className={styles.inputIcon} />}
      <textarea
        ref={ref}
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

export default TextArea;
