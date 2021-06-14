import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const Button = ({
  children,
  type = 'button',
  primary,
  onClick = () => { },
  medium,
  large,
}) => (
  <button
    onClick={onClick}
    type={type}
    className={
      cx(styles.button, {
        [styles.primary]: primary,
        [styles.medium]: medium,
        [styles.large]: large,
      })
    }
  >
    {children}
  </button>
);

export default Button;
