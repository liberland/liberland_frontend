import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function ScrollTo({ deps, children }) {
  const scrollToRef = useRef();
  useLayoutEffect(() => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <div ref={scrollToRef}>
      {children}
    </div>
  );
}

ScrollTo.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  deps: PropTypes.array.isRequired,
};
