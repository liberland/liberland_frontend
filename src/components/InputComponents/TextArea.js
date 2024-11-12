/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

function TextArea({
  id,
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
  onChange,
  className,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, v]);

  return (
    <div ref={ref} className={cx(styles.inputWrapper, className)}>
      {Icon && <Icon className={styles.inputIcon} />}
      <textarea
        id={id}
        ref={ref}
        className={cx(styles.input, { [styles.withIcon]: Icon && withIcon })}
        name={name}
        placeholder={placeholder}
        width={width}
        value={value}
        disabled={disabled}
        onPaste={onPaste}
        onChange={onChange}
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
