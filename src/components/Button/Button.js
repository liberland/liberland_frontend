import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ButtonInternal from 'antd/es/button';
import styles from './styles.module.scss';

function Button({
  children,
  type = 'button',
  primary,
  onClick = () => { },
  large,
  little,
  small,
  nano,
  className,
  secondary,
  green,
  grey,
  red,
  whiteRed,
  disabled,
}) {
  const getColor = () => {
    if (primary) {
      return 'primary';
    }
    if (red) {
      return 'danger';
    }
    return 'default';
  };

  const getSize = () => {
    if (large) {
      return 'large';
    }
    if (small) {
      return 'small';
    }
    return 'middle';
  };

  return (
    <ButtonInternal
      disabled={disabled}
      onClick={onClick}
      type={type}
      color={getColor()}
      size={getSize()}
      className={
        cx(styles.button, className, {
          [styles.secondary]: secondary,
          [styles.little]: little,
          [styles.nano]: nano,
          [styles.green]: green,
          [styles.grey]: grey,
          [styles.whiteRed]: whiteRed,
        })
      }
    >
      {children}
    </ButtonInternal>
  );
}

Button.defaultProps = {
  type: 'button',
  primary: false,
  onClick: () => {},
  large: false,
  little: false,
  small: false,
  nano: false,
  className: '',
  secondary: false,
  green: false,
  grey: false,
  red: false,
  whiteRed: false,
  disabled: false,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  large: PropTypes.bool,
  little: PropTypes.bool,
  small: PropTypes.bool,
  nano: PropTypes.bool,
  className: PropTypes.string,
  secondary: PropTypes.bool,
  green: PropTypes.bool,
  grey: PropTypes.bool,
  red: PropTypes.bool,
  whiteRed: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
