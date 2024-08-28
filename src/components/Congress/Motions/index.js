import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

// REDUX
import { congressActions, identityActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';

export default function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  useEffect(() => {
    if (!motions?.names) return;
    dispatch(identityActions.getIdentityMotions.call(motions.names));
  }, [dispatch, motions]);

  if (!motions || !motions.proposalsData || motions.proposalsData.length < 1) {
    return (<div>There are no open motions</div>);
  }

  return (
    <div className={styles.wrapper}>
      {motions.proposalsData.map(({ proposal, proposalOf, voting }) => (
        <Motion
          key={proposal}
          proposal={proposal.toString()}
          proposalOf={proposalOf.unwrap()}
          voting={voting.unwrap()}
          voteMotion={(data) => congressActions.voteAtMotions.call(data)}
          closeMotion={(data) => congressActions.closeMotion.call(data)}
        />
      ))}
    </div>
  );
}
