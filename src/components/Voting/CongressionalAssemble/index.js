/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { democracySelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';

import CurrentAssemble from './CurrentAssemble';
import CandidateVoting from './CandidateVoting';

function CongressionalAssemble() {
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [eligibleUnselectedCandidates, setEligibleUnselectedCandidates] = useState([]);
  const [didChangeSelectedCandidates, setDidChangeSelectedCandidates] = useState(false);
  console.log('democracycngrs ass');
  console.log(democracy);

  const selectCandidate = (politician) => {
    const newSelectedCandidates = selectedCandidates;
    newSelectedCandidates.push(politician);
    setSelectedCandidates(newSelectedCandidates);
    let newEligibleUnselectedCandidates = eligibleUnselectedCandidates;
    newEligibleUnselectedCandidates = newEligibleUnselectedCandidates.filter((candidate) => {
      if (candidate.rawIdentity === politician.rawIdentity) { return false; }
      return true;
    });
    setEligibleUnselectedCandidates(newEligibleUnselectedCandidates);
    setDidChangeSelectedCandidates(true);
  };

  const unselectCandidate = (politician) => {
    const newEligibleUnselectedCandidates = eligibleUnselectedCandidates;
    newEligibleUnselectedCandidates.push(politician);
    setEligibleUnselectedCandidates(newEligibleUnselectedCandidates);
    let newSelectedCandidates = selectedCandidates;
    newSelectedCandidates = newSelectedCandidates.filter((candidate) => {
      if (candidate.rawIdentity === politician.rawIdentity) { return false; }
      return true;
    });
    setSelectedCandidates(newSelectedCandidates);
    setDidChangeSelectedCandidates(true);
  };

  const moveSelectedCandidate = (politician, direction) => {
    const newSelectedCandidates = selectedCandidates.slice();
    const selectedPoliticianArrayIndex = findPoliticianIndex(selectedCandidates, politician);
    const swapPlaceWithIndex = direction === 'up' ? selectedPoliticianArrayIndex - 1 : selectedPoliticianArrayIndex + 1;
    if (swapPlaceWithIndex < 0 || swapPlaceWithIndex > (newSelectedCandidates.length - 1)) {
      return false;
    }
    const swapWithPolitician = newSelectedCandidates[swapPlaceWithIndex];
    newSelectedCandidates[swapPlaceWithIndex] = politician;
    newSelectedCandidates[selectedPoliticianArrayIndex] = swapWithPolitician;
    setSelectedCandidates(newSelectedCandidates);
    setDidChangeSelectedCandidates(true);
  };

  const findPoliticianIndex = (ar, el) => {
    let indexOfPolitician = false;
    for (let i = 0; i < ar.length; i++) {
      if (ar[i].rawIdentity === el.rawIdentity) { indexOfPolitician = i; }
    }
    return indexOfPolitician;
  };

  useEffect(() => {
    setSelectedCandidates(democracy?.democracy?.currentCandidateVotesByUser);
    let filteredEligibleUnselectedCandidates = democracy?.democracy?.currentCongressMembers?.concat(democracy?.democracy?.candidates);
    filteredEligibleUnselectedCandidates = filteredEligibleUnselectedCandidates?.filter((candidate) => {
      let shouldKeep = true;
      democracy?.democracy?.currentCandidateVotesByUser?.forEach((votedForCandidate) => {
        if (votedForCandidate.rawIdentity === candidate.rawIdentity) {
          shouldKeep = false;
        }
      });
      return shouldKeep;
    });
    setEligibleUnselectedCandidates(filteredEligibleUnselectedCandidates);
  }, [democracy]);

  const onSubmitVote = () => {};
  return (
    <div>
      <CurrentAssemble currentCongressMembers={democracy?.democracy?.currentCongressMembers} />
      <div style={{ height: '15px' }} />
      <CandidateVoting
        eligibleUnselectedCandidates={eligibleUnselectedCandidates}
        selectedCandidates={selectedCandidates}
        selectCandidate={selectCandidate}
        unselectCandidate={unselectCandidate}
        moveSelectedCandidate={moveSelectedCandidate}
        didChangeSelectedCandidates={didChangeSelectedCandidates}
      />

    </div>
  );
}

export default CongressionalAssemble;
