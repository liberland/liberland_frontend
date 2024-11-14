import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(senateSelectors.motions);
  const userIsMember = useSelector(senateSelectors.userIsMember);
  const { motionIds } = useMotionContext();
  const divRef = useRef(null);

  useEffect(() => {
    dispatch(senateActions.senateGetMotions.call());
  }, [dispatch]);

  useEffect(() => {
    if (divRef.current) {
      const votes = motions.map((item) => item.votes);
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
    }
  }, [motions, motionIds, dispatch]);

  if (!motions || motions.length < 1) {
    return (<div>There are no open motions</div>);
  }

  return (
    <>
      {motions.map(({
        proposal, proposalOf, voting, membersCount,
      }, index) => {
        const isLastItem = motions.length - 1 === index;
        return (
          <div ref={isLastItem ? divRef : null} key={proposal}>
            <Motion
              userIsMember={userIsMember}
              membersCount={membersCount}
              proposal={proposal.toString()}
              proposalOf={proposalOf}
              voting={voting.unwrap()}
              voteMotion={(data) => senateActions.senateVoteAtMotions.call(data)}
              closeMotion={(data) => senateActions.senateCloseMotion.call(data)}
            />
          </div>
        );
      })}

    </>
  );
}

export default Motions;
