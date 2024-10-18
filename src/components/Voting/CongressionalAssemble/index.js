/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';
import CurrentAssemble from './CurrentAssemble';
import CandidateVoting from './CandidateVoting';
import { democracyActions } from '../../../redux/actions';
import AgreeDisagreeModal from '../../Modals/AgreeDisagreeModal';
import CongressionalCountdown from './CongressionalCountdown';
import ModalRoot from '../../Modals/ModalRoot';
import stylesModal from '../../Modals/styles.module.scss';

function CongressionalAssemble() {
  const isNotTablet = useMediaQuery('(min-width: 768px)');
  const history = useHistory();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [eligibleUnselectedCandidates, setEligibleUnselectedCandidates] = useState([]);
  const [didChangeSelectedCandidates, setDidChangeSelectedCandidates] = useState(false);
  const [isSideBlocked, setIsSideBlocked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigationToLeave, setNavigationToLeave] = useState(null);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
    setDidChangeSelectedCandidates(false);
  }, [dispatch, userWalletAddress]);

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
  };

  const handleUpdate = () => {
    dispatch(democracyActions.voteForCongress.call({ selectedCandidates, userWalletAddress }));
    setIsModalOpen(false);
    setDidChangeSelectedCandidates(false);
    setIsSideBlocked(true);
  };

  const handleDiscardChanges = () => {
    setIsModalOpen(false);
    history.push(navigationToLeave);
  };

  useEffect(() => {
    const {
      currentCongressMembers, candidates, runnersUp, currentCandidateVotesByUser,
    } = democracy?.democracy || {};
    setSelectedCandidates(currentCandidateVotesByUser);

    const allMembers = [
      ...(currentCongressMembers || []),
      ...(candidates || []),
      ...(runnersUp || []),
    ];
    const votedForRawIdentities = new Set(
      (currentCandidateVotesByUser || []).map((votedForCandidate) => votedForCandidate.rawIdentity),
    );

    const filteredEligibleUnselectedCandidates = allMembers.filter(
      (member) => !votedForRawIdentities.has(member.rawIdentity),
    );
    setEligibleUnselectedCandidates(filteredEligibleUnselectedCandidates);
  }, [democracy]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (didChangeSelectedCandidates) {
        event.preventDefault();
        const confirmationMessage = 'Are you sure you want to leave? Your changes will be lost.';
        // eslint-disable-next-line no-param-reassign
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return null;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [didChangeSelectedCandidates]);

  useEffect(() => {
    let unblock;

    if (isSideBlocked && didChangeSelectedCandidates) {
      unblock = history.block((location) => {
        setNavigationToLeave(location.pathname);
        setIsModalOpen(true);
        setIsSideBlocked(false);
        return false;
      });
    }

    return () => {
      if (unblock) {
        unblock();
      }
    };
  }, [history, didChangeSelectedCandidates, isSideBlocked]);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

  const termDuration = democracy?.democracy?.electionsInfo?.termDuration;

  return (
    <>
      {isModalOpen
      && (
      <ModalRoot>
        <AgreeDisagreeModal
          text=""
          buttonLeft="CANCEL AND LEAVE PAGE"
          buttonRight="UPDATE VOTE"
          style={cx(stylesModal.getCitizenshipModal, styles.modal)}
          onDisagree={handleDiscardChanges}
          onAgree={() => handleUpdate()}
        >
          <h3>
            {isNotTablet

              ? (
                <>
                  Your voting preferences haven&#96;t been
                  <br />
                  {' '}
                  saved, would you like to save them?
                </>
              )
              : (
                <>
                  Your voting preferences
                  <br />
                  haven&#96;t been saved,
                  <br />
                  would you like to save them?
                </>
              )}

          </h3>
        </AgreeDisagreeModal>
      </ModalRoot>
      )}
      <div className={cx(stylesPage.contentWrapper, styles.contentWrapper)}>
        {democracy?.democracy?.currentCongressMembers
      && <CurrentAssemble currentCongressMembers={democracy?.democracy?.currentCongressMembers} />}
        {selectedCandidates && (
        <CandidateVoting
          handleUpdate={handleUpdate}
          eligibleUnselectedCandidates={eligibleUnselectedCandidates}
          selectedCandidates={selectedCandidates}
          selectCandidate={selectCandidate}
          unselectCandidate={unselectCandidate}
          moveSelectedCandidate={moveSelectedCandidate}
          didChangeSelectedCandidates={didChangeSelectedCandidates}
        />
        )}
        {termDuration && (
          <CongressionalCountdown termDuration={termDuration} />
        )}
      </div>
    </>

  );
}

export default CongressionalAssemble;
