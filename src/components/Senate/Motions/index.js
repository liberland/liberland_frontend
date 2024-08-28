import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(senateSelectors.motions);
  useEffect(() => {
    dispatch(senateActions.senateGetMotions.call());
  }, [dispatch]);

  useEffect(() => {
    if (!motions?.names) return;
    dispatch(identityActions.getIdentityMotions.call(motions.names));
  }, [dispatch, motions]);

  if (!motions || !motions.proposalsData || motions.proposalsData.length < 1) {
    return (<div>There are no open motions</div>);
  }

  return (
    <>
      {motions.proposalsData.map(({ proposal, proposalOf, voting }) => (
        <Motion
          key={proposal}
          proposal={proposal.toString()}
          proposalOf={proposalOf.unwrap()}
          voting={voting.unwrap()}
          voteMotion={(data) => senateActions.senateVoteAtMotions.call(data)}
          closeMotion={(data) => senateActions.senateCloseMotion.call(data)}
        />
      ))}
    </>
  );
}

export default Motions;
