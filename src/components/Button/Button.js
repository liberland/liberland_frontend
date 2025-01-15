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
  newTab,
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
    if (link) {
      return 'link';
    }
    return undefined;
  };

  const getOnClick = () => {
    if (href && onClick) {
      return (e) => {
        e.preventDefault();
        onClick(e);
      };
    }
    return onClick;
  };

  return (
    <ButtonInternal
      disabled={disabled}
      onClick={getOnClick()}
      htmlType={type}
      type={getType()}
      target={newTab ? '_blank' : undefined}
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
  newTab: PropTypes.bool,
};

export default Button;
