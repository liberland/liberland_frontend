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
import ProposeLegislationReferendumButton from '../ProposeLegislationReferendumButton';

export default function Overview() {
  const dispatch = useDispatch();
  const candidates = useSelector(congressSelectors.candidates);
  const members = useSelector(congressSelectors.members);
  const runnersUp = useSelector(congressSelectors.runnersUp);

  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(congressActions.getCandidates.call());
    dispatch(congressActions.getMembers.call());
    dispatch(congressActions.getRunnersUp.call());
  }, [dispatch]);

  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const handleSpendingModalOpen = () => setIsSpendingModalOpen(!isSpendingModalOpen);

  const senderIsCandidate = candidates.find(
    (candidate) => candidate[0] === sender,
  );
  const senderIsMember = members.find(
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
      {senderIsMember && (
      <>
        <ProposeLegislationButton />
        <ProposeLegislationReferendumButton />
        <Button
          medium
          primary
          onClick={handleSpendingModalOpen}
        >
          Create new spending
        </Button>
      </>
      )}
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
    </div>
  );
}
