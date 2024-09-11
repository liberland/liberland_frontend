import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(senateSelectors.motions);
  useEffect(() => {
    dispatch(senateActions.senateGetMotions.call());
  }, [dispatch]);

  if (!motions || motions.length < 1) {
    return (<div>There are no open motions</div>);
  }

  return (
    <>
      {motions.map(({ proposal, proposalOf, voting }) => (
        <Motion
          key={proposal}
          proposal={proposal.toString()}
          proposalOf={proposalOf}
          voting={voting.unwrap()}
          voteMotion={(data) => senateActions.senateVoteAtMotions.call(data)}
          closeMotion={(data) => senateActions.senateCloseMotion.call(data)}
        />
      ))}
    </>
  );
}

export default Motions;
