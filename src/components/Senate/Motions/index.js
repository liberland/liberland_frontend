import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import MotionsBoard from '../../WalletCongresSenate/MotionsBoard';
import MotionDetail from '../../WalletCongresSenate/MotionDetail';
import router from '../../../router';

const voteMotion = (data) => senateActions.senateVoteAtMotions.call(data);
const closeMotion = (data) => senateActions.senateCloseMotion.call(data);
const detailPath = (hash) => `${router.senate.motions}/${hash}`;

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(senateSelectors.motions);
  const userIsMember = useSelector(senateSelectors.userIsMember);
  const isLoading = useSelector(senateSelectors.isLoading);
  const { motionIds } = useMotionContext();

  const detail = useRouteMatch({ path: router.senate.motion, exact: true });

  useEffect(() => {
    dispatch(senateActions.senateGetMembers.call());
    dispatch(senateActions.senateGetMotions.call());
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
        backPath={router.senate.motions}
        backLabel="All Senate motions"
      />
    );
  }

  return (
    <MotionsBoard
      motions={motions}
      detailPath={detailPath}
      emptyText="There are no open motions before the Senate"
    />
  );
}

export default Motions;
