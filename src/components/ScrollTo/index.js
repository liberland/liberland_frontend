import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

export default function ScrollTo({ deps, children }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return children;
}

ScrollTo.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  deps: PropTypes.array.isRequired,
};
