import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import ScrollTo from '../../ScrollTo';

export default function ScrollContainer({ children }) {
  const { pathname } = useLocation();
  return (
    <ScrollTo deps={[pathname]}>
      {children}
    </ScrollTo>
  );
}

ScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
