import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

export default function ScrollTo({ deps, children }) {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return children;
}

ScrollTo.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  deps: PropTypes.array.isRequired,
};
