import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../Card';
import CandidateCard from '../CandidateCard';
import SelectedCandidateCard from '../SelectedCandidateCard';
import Button from '../../../Button/Button';
import { blockchainSelectors } from '../../../../redux/selectors';
import { democracyActions } from '../../../../redux/actions';
import stylesPage from '../../../../utils/pagesBase.module.scss';

function CandidateVoting({
  eligibleUnselectedCandidates, selectedCandidates, selectCandidate, unselectCandidate,
  moveSelectedCandidate, didChangeSelectedCandidates,
}) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();
  return (
    <Card className={stylesPage.overviewWrapper} title="Voting">
      <div className={styles.candidateVotingContainer}>
        <div className={styles.eligibleCandidatesContainer}>
          <div className={styles.headerWithButton}>
            <span className={styles.candidatesHeader}>Eligible Candidates (including current congressmen)</span>
          </div>
          <div className={styles.candidatesList}>
            {
                eligibleUnselectedCandidates?.map((eligibleUnselectedCandidate) => (
                  <CandidateCard
                    politician={eligibleUnselectedCandidate}
                    selectCandidate={selectCandidate}
                    key={`candidate-${eligibleUnselectedCandidate.name}`}
                  />
                ))
              }
          </div>
        </div>
        <div className={styles.selectedCandidatesContainer}>
          <div className={styles.headerWithButton}>
            <span className={styles.candidatesHeader}>My preference ordered Votes</span>
            <Button
              primary={didChangeSelectedCandidates}
              onClick={() => dispatch(democracyActions.voteForCongress.call({ selectedCandidates, userWalletAddress }))}
            >
              UPDATE VOTE
            </Button>
          </div>
          <div className={styles.currentlySelectedCandidatesList}>
            {
                selectedCandidates?.map((currentCandidateVoteByUser) => (
                  <SelectedCandidateCard
                    key={currentCandidateVoteByUser.name}
                    politician={currentCandidateVoteByUser}
                    unselectCandidate={unselectCandidate}
                    moveSelectedCandidate={moveSelectedCandidate}
                  />
                ))
              }
          </div>
        </div>
      </div>
    </Card>
  );
}

const candidate = PropTypes.shape({
  name: PropTypes.string.isRequired,
  rawIdentity: PropTypes.string.isRequired,
});

CandidateVoting.propTypes = {
  eligibleUnselectedCandidates: PropTypes.arrayOf(candidate).isRequired,
  selectedCandidates: PropTypes.arrayOf(candidate).isRequired,
  selectCandidate: PropTypes.func.isRequired,
  unselectCandidate: PropTypes.func.isRequired,
  moveSelectedCandidate: PropTypes.func.isRequired,
  didChangeSelectedCandidates: PropTypes.bool.isRequired,
};

export default CandidateVoting;
