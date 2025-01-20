import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { identityActions } from '../../../redux/actions';

export const useIdentitiesDispatch = (addresses) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(addresses));
  }, [dispatch, addresses]);
};
