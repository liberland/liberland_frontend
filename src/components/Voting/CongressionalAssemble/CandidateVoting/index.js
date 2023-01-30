import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../Card';
import CandidateCard from '../CandidateCard';
import SelectedCandidateCard from '../SelectedCandidateCard';
import Button from '../../../Button/Button';
import { voteForCongress } from '../../../../api/nodeRpcCall';
import { blockchainSelectors } from '../../../../redux/selectors';
import {democracyActions, walletActions} from "../../../../redux/actions";

function CandidateVoting({
  eligibleUnselectedCandidates, selectedCandidates, selectCandidate, unselectCandidate, moveSelectedCandidate, didChangeSelectedCandidates,
}) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();
  return (
    <div>
      <Card title="">
        <div className={styles.candidateVotingHeader}>Voting</div>
        <div className={styles.candidateVotingContainer}>
          <div className={styles.eligibleCandidatesContainer}>
            <div className={styles.candidatesHeader}>
              <div>Eligible candidates</div>
            </div>
            <div className={styles.candidatesSubtext}>
              <div>Including current congressmen</div>
            </div>
            <div className={styles.candidatesList}>
              {
                eligibleUnselectedCandidates?.map((eligibleUnselectedCandidate) => <CandidateCard politician={eligibleUnselectedCandidate} selectCandidate={selectCandidate} key={`candidate-${eligibleUnselectedCandidate.name}`} />)
              }
            </div>
          </div>
          <div className={styles.selectedCandidatesContainer}>
            <div className={styles.candidatesHeader}>
              <div>My preference ordered Votes</div>
            </div>
            <div className={styles.candidatesSubtext}>
              <Button primary={didChangeSelectedCandidates} medium onClick={() => dispatch(democracyActions.voteForCongress.call({selectedCandidates: selectedCandidates, userWalletAddress: userWalletAddress}))}>
                Update Vote
              </Button>
            </div>
            <div className={styles.currentlySelectedCandidatesList}>
              {
                selectedCandidates?.map((currentCandidateVoteByUser) => <SelectedCandidateCard key={currentCandidateVoteByUser.name} politician={currentCandidateVoteByUser} unselectCandidate={unselectCandidate} moveSelectedCandidate={moveSelectedCandidate} />)
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
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
