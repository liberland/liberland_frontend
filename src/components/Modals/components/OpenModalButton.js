import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';

function OpenModalButton({ text, children, ...props }) {
  return (
    <Button {...props}>
      {text}
      {children}
    </Button>
  );
}

OpenModalButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string,
  children: PropTypes.node,
};

OpenModalButton.defaultProps = {
  text: '',
  children: null,
};

export default OpenModalButton;
