import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import Button from '../../Button/Button';
import { ReactComponent as UserCandidacyWhite } from '../../../assets/icons/user-candidacy-white.svg';
import { ReactComponent as UserCongressional } from '../../../assets/icons/user-congressional.svg';

import styles from './styles.module.scss';
import { votingActions } from '../../../redux/actions';
import { votingSelectors, blockchainSelectors } from '../../../redux/selectors';

// eslint-disable-next-line react/prop-types
const CongressionalAssemblyElectionsHeader = ({ handlerOnClickApplyMyCandidacy }) => {
  const isVotingInProgress = useSelector(votingSelectors.selectorIsVotingInProgress);
  const currentNumVoting = useSelector(blockchainSelectors.eraOfElectionSelector);
  const endOfElection = useSelector(blockchainSelectors.endElectionsAssemblySelector);

  const options = {
    year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch(votingActions.setIsVotingInProgress.call());
      dispatch(votingActions.getListOfCandidacy.call());
      dispatch(votingActions.getLiberStakeAmount.call());
    }, 6000);
    return (() => {
      clearInterval(timerId);
    });
  }, [dispatch, isVotingInProgress]);

  return (
    <>
      <div className={styles.headCongressional}>
        <div className={styles.headCongressionalFirstItem}>
          <UserCongressional />
          <h3>
            {currentNumVoting.toFixed(2)}
            {' '}
            Congressional Assembly Elections
          </h3>
        </div>
        <span className={styles.headCongressionalSecondItem}>
          Election finishes
          {' '}
          {new Intl.DateTimeFormat('en-US', options).format(endOfElection)}
        </span>
      </div>
      <Button primary className={styles.upcomingVotings} onClick={handlerOnClickApplyMyCandidacy}>
        <UserCandidacyWhite />
        {' '}
        Apply my candidacy
      </Button>
    </>
  );
};

export default CongressionalAssemblyElectionsHeader;
