import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import SpendingMotionModal from '../../Modals/SpendingMotionModal';
import styles from '../styles.module.scss';
import ProposeLegislationButton from '../ProposeLegislationButton';

export default function Overview() {
  const dispatch = useDispatch();
  const congressCandidates = useSelector(congressSelectors.congressCandidates);
  const congressMembers = useSelector(congressSelectors.congressMembers);
  const runnersUp = useSelector(congressSelectors.runnersUp);

  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(congressActions.getCongressCandidates.call());
    dispatch(congressActions.getCongressMembers.call());
    dispatch(congressActions.getRunnersUp.call());
  }, [dispatch]);

  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const handleSpendingModalOpen = () => setIsSpendingModalOpen(!isSpendingModalOpen);

  const senderIsCandidate = congressCandidates.find(
    (candidate) => candidate[0] === sender,
  );
  const senderIsMember = congressMembers.find(
    (member) => member.toString() === sender,
  );
  const senderIsRunnerUp = runnersUp.find(
    (member) => member.toString() === sender,
  );

  let userStatus = 'None';
  if (senderIsMember) userStatus = 'Member';
  else if (senderIsCandidate) userStatus = 'Candidate';
  else if (senderIsRunnerUp) userStatus = 'RunnerUp';

  return (
    <div className={styles.navWrapper}>
      <span>
        User congress status:
        {' '}
        {userStatus}
      </span>
      {!senderIsCandidate && !senderIsMember && !senderIsRunnerUp && (
        <Button
          medium
          primary
          onClick={() => dispatch(congressActions.applyForCongress.call())}
        >
          Apply for Congress
        </Button>
      )}
      <Button
        medium
        primary
        onClick={handleSpendingModalOpen}
      >
        Create new spending
      </Button>
      {isSpendingModalOpen && <SpendingMotionModal closeModal={handleSpendingModalOpen} />}
      {(senderIsMember || senderIsCandidate || senderIsRunnerUp) && (
        <Button
          medium
          primary
          onClick={() => dispatch(congressActions.renounceCandidacy.call(userStatus))}
        >
          Renounce candidacy
        </Button>
      )}
      <ProposeLegislationButton />
    </div>
  );
}
