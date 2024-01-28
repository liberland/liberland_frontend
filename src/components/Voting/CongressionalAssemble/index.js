/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { democracySelectors } from '../../../redux/selectors';
import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';
import CurrentAssemble from './CurrentAssemble';
import CandidateVoting from './CandidateVoting';
import { democracyActions } from '../../../redux/actions';

function CongressionalAssemble() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [eligibleUnselectedCandidates, setEligibleUnselectedCandidates] = useState([]);
  const [didChangeSelectedCandidates, setDidChangeSelectedCandidates] = useState(false);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

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

  const findPoliticianIndex = (ar, el) => {
    // FIXME refactor to use ar.findIndex
    let indexOfPolitician = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ar.length; i++) {
      if (ar[i].rawIdentity === el.rawIdentity) { indexOfPolitician = i; }
    }
    return indexOfPolitician;
  };

  const moveSelectedCandidate = (politician, direction) => {
    const newSelectedCandidates = selectedCandidates.slice();
    const selectedPoliticianArrayIndex = findPoliticianIndex(selectedCandidates, politician);
    const swapPlaceWithIndex = direction === 'up' ? selectedPoliticianArrayIndex - 1 : selectedPoliticianArrayIndex + 1;
    if (swapPlaceWithIndex < 0 || swapPlaceWithIndex > (newSelectedCandidates.length - 1)) {
      return;
    }
    const swapWithPolitician = newSelectedCandidates[swapPlaceWithIndex];
    newSelectedCandidates[swapPlaceWithIndex] = politician;
    newSelectedCandidates[selectedPoliticianArrayIndex] = swapWithPolitician;
    setSelectedCandidates(newSelectedCandidates);
    setDidChangeSelectedCandidates(true);
    return false;
  };

  useEffect(() => {
    setSelectedCandidates(democracy?.democracy?.currentCandidateVotesByUser);
    const members = democracy?.democracy?.currentCongressMembers;
    let filteredEligibleUnselectedCandidates = members?.concat(democracy?.democracy?.candidates);
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

  return (
    <div className={cx(stylesPage.contentWrapper, styles.contentWrapper)}>
      <CurrentAssemble currentCongressMembers={democracy?.democracy?.currentCongressMembers} />
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
