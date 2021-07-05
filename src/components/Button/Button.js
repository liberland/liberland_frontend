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

Button.defaultProps = {
  type: 'button',
  primary: false,
  onClick: () => {},
  medium: false,
  large: false,
  small: false,
  className: '',
  secondary: false,
  green: false,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  className: PropTypes.string,
  secondary: PropTypes.bool,
  green: PropTypes.bool,
};

export default Button;
