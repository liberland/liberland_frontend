import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

// REDUX
import { congressActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';

export default function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  if (!motions || motions.length < 1) {
    return (<div>There is no any motion</div>);
  }

  return (
    <div className={styles.wrapper}>
      {motions.map(({ proposal, proposalOf, voting }) => (
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
