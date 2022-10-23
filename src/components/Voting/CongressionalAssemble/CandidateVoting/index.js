import React, {useEffect, useState} from 'react';
import styles from './styles.module.scss';
import Card from "../../../Card";
import CandidateCard from "../CandidateCard";
import SelectedCandidateCard from "../SelectedCandidateCard";
import Button from "../../../Button/Button";
import {voteForCongress} from "../../../../api/nodeRpcCall";
import {useSelector} from "react-redux";
import {blockchainSelectors} from "../../../../redux/selectors";

const CandidateVoting = ({
  eligibleUnselectedCandidates, selectedCandidates, selectCandidate, unselectCandidate, moveSelectedCandidate, didChangeSelectedCandidates
}) => {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  return (
    <div>
      <Card>
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
                eligibleUnselectedCandidates?.map((currentCongressMember) => <CandidateCard politician={currentCongressMember} selectCandidate={selectCandidate} />)
              }
            </div>
          </div>
          <div className={styles.selectedCandidatesContainer}>
            <div className={styles.candidatesHeader}>
              <div>My preference ordered Votes</div>
            </div>
            <div className={styles.candidatesSubtext}>
              <Button primary={didChangeSelectedCandidates} medium onClick={() => voteForCongress(selectedCandidates, userWalletAddress)}>
                Update Vote
              </Button>
            </div>
            <div className={styles.currentlySelectedCandidatesList}>
              {
                selectedCandidates?.map((currentCandidateVoteByUser) => <SelectedCandidateCard politician={currentCandidateVoteByUser} unselectCandidate={unselectCandidate} moveSelectedCandidate={moveSelectedCandidate} />)
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CandidateVoting
