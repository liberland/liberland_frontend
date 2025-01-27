import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

function OpenModalButton(props) {
  const { text } = props;
  return (
    <Button {...props}>
      {text}
    </Button>
  );
}

export default OpenModalButton;

OpenModalButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
