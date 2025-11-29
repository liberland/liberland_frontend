import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { identitySelectors } from '../../redux/selectors';
import { identityActions } from '../../redux/actions';

function XProvider({
  children,
  handle,
}) {
  const dispatch = useDispatch();
  const profiles = useSelector(identitySelectors.selectorX);
  const profile = profiles[handle];
  useEffect(() => {
    if (handle) {
      dispatch(identityActions.getX.call({ handle }));
    }
  }, [handle, dispatch]);
  return children(profile || {});
}

XProvider.propTypes = {
  children: PropTypes.func.isRequired,
  handle: PropTypes.string,
};

export default XProvider;
