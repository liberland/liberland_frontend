import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ButtonInternal from 'antd/es/button';
import styles from './styles.module.scss';

function Button({
  children,
  type = 'button',
  primary,
  onClick,
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
  flex,
  disabled,
  multiline,
  href,
  link,
}) {
  const getSize = () => {
    if (large) {
      return 'large';
    }
    if (small) {
      return 'small';
    }
    return undefined;
  };

  const getType = () => {
    if (primary) {
      return 'primary';
    }
    if (href || link) {
      return 'link';
    }
    return undefined;
  };

  return (
    <ButtonInternal
      disabled={disabled}
      onClick={onClick}
      htmlType={type}
      type={getType()}
      href={href}
      danger={red}
      size={getSize()}
      className={
        cx(styles.button, className, {
          [styles.secondary]: secondary,
          [styles.little]: little,
          [styles.nano]: nano,
          [styles.green]: green,
          [styles.grey]: grey,
          [styles.whiteRed]: whiteRed,
          [styles.flex]: flex,
          [styles.multiline]: multiline,
        })
      }
    >
      {children}
    </ButtonInternal>
  );
}

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
  flex: PropTypes.bool,
  href: PropTypes.string,
  multiline: PropTypes.bool,
  link: PropTypes.bool,
};

export default Button;
