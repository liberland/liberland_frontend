import React from 'react';
import PropTypes from 'prop-types';

function LoadingNoDataWrapper({ length, children }) {
  let content;
  if (length >= 1) {
    content = children;
  } else {
    content = <div>No data...</div>;
  }

  return content;
}

LoadingNoDataWrapper.propTypes = {
  length: PropTypes.number,
  children: PropTypes.node.isRequired,
};

LoadingNoDataWrapper.defaulProps = {
  length: 0,
};

export default LoadingNoDataWrapper;
