import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

// REDUX
import { congressActions, identityActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import ProposalContainer from '../../Proposal/ProposalContainer';

export default function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);
  const { motionIds } = useMotionContext();
  const divRef = useRef(null);

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  useEffect(() => {
    if (divRef.current && motionIds.length > 0) {
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds))));
    }
  }, [motions, motionIds, dispatch]);

  if (!motions || motions.length < 1) {
    return (<div>There are no open motions</div>);
  }

  return (
    <ProposalContainer>
      <div className={styles.wrapper}>
        {motions.map(({
          proposal, proposalOf, voting, membersCount,
        }, index) => (
          <div ref={motions.length - 1 === index ? divRef : null} key={proposal}>
            <Motion
              membersCount={membersCount}
              key={proposal}
              proposal={proposal.toString()}
              proposalOf={proposalOf.unwrap()}
              voting={voting.unwrap()}
              voteMotion={(data) => congressActions.voteAtMotions.call(data)}
              closeMotion={(data) => congressActions.closeMotion.call(data)}
              isTableRow
            />
          </div>
        ))}
      </div>
    </ProposalContainer>
  );
}
