import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identityActions } from '../../redux/actions';
import { identitySelectors } from '../../redux/selectors';

const useUsersId = (listOfProposers) => {
  const dispatch = useDispatch();
  const usersList = useSelector(identitySelectors.selectorIdentities);

  useEffect(() => {
    if (listOfProposers.length < 1) return;
    const newList = Array.from(new Set(listOfProposers));
    dispatch(identityActions.getIdentities.call(newList));
  }, [dispatch, listOfProposers]);

  return { usersList };
};

export default useUsersId;
