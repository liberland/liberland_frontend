import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';

function OpenModalButton({
  text,
  children,
  asText,
  ...props
}) {
  if (asText) {
    return (
      <div
        role="button"
        className={styles.textButton}
        {...props}
      >
        {text}
        {children}
      </div>
    );
  }
  return (
    <Button {...props}>
      {text}
      {children}
    </Button>
  );
}

OpenModalButton.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  asText: PropTypes.bool,
};

OpenModalButton.defaultProps = {
  text: '',
  children: null,
};

export default OpenModalButton;
