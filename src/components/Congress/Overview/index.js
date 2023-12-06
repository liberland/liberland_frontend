import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
} from '../../../redux/selectors';
import SpendingMotionModal from '../../Modals/SpendingMotionModal';
import styles from '../styles.module.scss';
import ProposeLegislationButton from '../ProposeLegislationButton';
import ProposeLegislationViaReferendumButton from '../ProposeLegislationViaReferendumButton';

export default function Overview() {
  const dispatch = useDispatch();

  const userIsMember = useSelector(congressSelectors.userIsMember);
  const userIsRunnersUp = useSelector(congressSelectors.userIsRunnersUp);
  const userIsCandidate = useSelector(congressSelectors.userIsCandidate);

  useEffect(() => {
    dispatch(congressActions.getCandidates.call());
    dispatch(congressActions.getMembers.call());
    dispatch(congressActions.getRunnersUp.call());
  }, [dispatch]);

  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const handleSpendingModalOpen = () => setIsSpendingModalOpen(!isSpendingModalOpen);

  let userStatus = 'None';
  if (userIsMember) userStatus = 'Member';
  else if (userIsCandidate) userStatus = 'Candidate';
  else if (userIsRunnersUp) userStatus = 'RunnerUp';

  return (
    <div className={styles.congressWrapper}>
      <div className={styles.rowWrapper}>
        <div className={styles.navCol}>
          <h4>User congress status</h4>
          <p>
            {' '}
            {userStatus}
          </p>
        </div>
        <div className={styles.rowEnd}>
          {!userIsCandidate && !userIsMember && !userIsRunnersUp && (
            <Button
              small
              primary
              onClick={() => dispatch(congressActions.applyForCongress.call())}
            >
              Apply for Congress
            </Button>
          )}
          {userIsMember && (
            <>
              <ProposeLegislationButton />
              <ProposeLegislationViaReferendumButton />
              <Button small primary onClick={handleSpendingModalOpen}>
                Create new spending
              </Button>
            </>
          )}
          {isSpendingModalOpen && (
            <SpendingMotionModal closeModal={handleSpendingModalOpen} />
          )}
          {(userIsMember || userIsCandidate || userIsRunnersUp) && (
            <Button
              small
              secondary
              onClick={() => dispatch(congressActions.renounceCandidacy.call(userStatus))}
            >
              Renounce
              {userIsMember ? ' Congress Membership' : null}
              {userIsCandidate || userIsRunnersUp ? ' Candidacy' : null}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
