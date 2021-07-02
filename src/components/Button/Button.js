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
  small,
  className,
  secondary,
  green,
}) => (
  <button
    onClick={onClick}
    type={type}
    className={
      cx(styles.button, className, {
        [styles.primary]: primary,
        [styles.secondary]: secondary,
        [styles.medium]: medium,
        [styles.large]: large,
        [styles.small]: small,
        [styles.green]: green,
      })
    }
  >
    {children}
  </button>
);

export default Button;
