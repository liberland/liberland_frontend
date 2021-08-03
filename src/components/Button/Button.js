import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './styles.module.scss';

const Button = ({
  children,
  type = 'button',
  primary,
  onClick = () => { },
  medium,
  large,
  little,
  small,
  nano,
  className,
  secondary,
  green,
  grey,
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
        [styles.little]: little,
        [styles.small]: small,
        [styles.nano]: nano,
        [styles.green]: green,
        [styles.grey]: grey,
      })
    }
  >
    {children}
  </button>
);

Button.defaultProps = {
  type: 'button',
  primary: false,
  onClick: () => {},
  medium: false,
  large: false,
  little: false,
  small: false,
  nano: false,
  className: '',
  secondary: false,
  green: false,
  grey: false,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  little: PropTypes.bool,
  small: PropTypes.bool,
  nano: PropTypes.bool,
  className: PropTypes.string,
  secondary: PropTypes.bool,
  green: PropTypes.bool,
  grey: PropTypes.bool,
};

export default Button;
