/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import Modal from 'antd/es/modal';
import Alert from 'antd/es/alert';
import { useHistory } from 'react-router-dom';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import CurrentAssemble from './CurrentAssemble';
import { democracyActions } from '../../../redux/actions';
import CongressionalCountdown from './CongressionalCountdown';
import CandidateCard from './CandidateCard';
import Button from '../../Button/Button';
import SelectedCandidateCard from './SelectedCandidateCard';

function CongressionalAssemble() {
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
      <Modal
        open={isModalOpen}
        title="Are you certain you want to leave the page?"
        onOk={() => handleUpdate()}
        onCancel={handleDiscardChanges}
        okText="Update vote"
        cancelText="Cancel and leave the page"
      >
        Your voting preferences haven&#96;t been saved, would you like to save them?
      </Modal>
      <Collapse
        defaultActiveKey={['current', 'voting', 'preference', 'term']}
        items={[
          democracy?.democracy?.currentCongressMembers && {
            key: 'current',
            label: 'Acting Congressional Assembly',
            children: (
              <CurrentAssemble currentCongressMembers={democracy?.democracy?.currentCongressMembers} />
            ),
          },
          selectedCandidates?.length && {
            key: 'voting',
            label: 'Voting',
            children: (
              <List
                grid={{ gutter: 16 }}
                dataSource={selectedCandidates}
                renderItem={(selectedCandidate) => (
                  <CandidateCard
                    politician={selectedCandidate}
                    selectCandidate={selectCandidate}
                  />
                )}
              />
            ),
          },
          {
            key: 'preference',
            label: 'My preference ordered Votes',
            extra: (
              <Button
                primary
                disabled={!didChangeSelectedCandidates}
                onClick={() => handleUpdate()}
              >
                Update vote
              </Button>
            ),
            children: selectedCandidates?.length ? (
              <List
                dataSource={selectedCandidates}
                grid={{ gutter: 16 }}
                renderItem={(currentCandidateVoteByUser) => (
                  <SelectedCandidateCard
                    politician={currentCandidateVoteByUser}
                    unselectCandidate={unselectCandidate}
                    moveSelectedCandidate={moveSelectedCandidate}
                  />
                )}
              />
            ) : <Alert type="info" message="No selected candidates" />,
          },
          termDuration && {
            label: 'Term duration',
            key: 'term',
            children: (
              <CongressionalCountdown termDuration={termDuration.toNumber()} />
            ),
          },
        ].filter(Boolean)}
      />
    </>
  );
}

export default CongressionalAssemble;
