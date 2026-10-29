import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { congressActions, identityActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import MotionsBoard from '../../WalletCongresSenate/MotionsBoard';
import MotionDetail from '../../WalletCongresSenate/MotionDetail';
import router from '../../../router';

const voteMotion = (data) => congressActions.voteAtMotions.call(data);
const closeMotion = (data) => congressActions.closeMotion.call(data);
const detailPath = (hash) => `${router.congress.motions}/${hash}`;

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const isLoading = useSelector(congressSelectors.isLoading);
  const { motionIds } = useMotionContext();

  // One route serves the board and a single motion, so the data is fetched
  // once here and a deep link to a motion works on a cold load.
  const detail = useRouteMatch({ path: router.congress.motion, exact: true });

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  useEffect(() => {
    const votes = motions.map((item) => item.votes);
    dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
  }, [motions, motionIds, dispatch]);

  if (detail) {
    return (
      <MotionDetail
        motions={motions}
        loading={isLoading}
        userIsMember={userIsMember}
        voteMotion={voteMotion}
        closeMotion={closeMotion}
        backPath={router.congress.motions}
        backLabel="All Congress motions"
      />
    );
  }

  return (
    <MotionsBoard
      motions={motions}
      detailPath={detailPath}
      emptyText="There are no open motions before Congress"
    />
  );
}

export default Motions;
