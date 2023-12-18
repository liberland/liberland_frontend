import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identityActions } from '../redux/actions';
import { identitySelectors } from '../redux/selectors';
import truncate from '../utils/truncate';

const useUsersId = (proposer, listOfProposers) => {
  const dispatch = useDispatch();
  const usersList = useSelector(identitySelectors.selectorIdentities);
  const userName = useMemo(() => usersList && usersList.find((item) => item.key === proposer)?.name, [usersList]);
  const userOrId = userName || (proposer && truncate(proposer, 13));

  useEffect(() => {
    if (proposer) {
      dispatch(identityActions.getIdentities.call(proposer));
    }

    if (listOfProposers) {
      // eslint-disable-next-line max-len
      listOfProposers.map((adress) => dispatch(identityActions.getIdentities.call(adress)));
    }
  }, [dispatch, proposer]);

  return { usersList, userName, userOrId };
};

export default useUsersId;
