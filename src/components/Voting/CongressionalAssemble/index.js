/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import Modal from 'antd/es/modal';
import Divider from 'antd/es/divider';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import { useHistory } from 'react-router-dom';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import CurrentAssemble from './CurrentAssemble';
import { democracyActions } from '../../../redux/actions';
import CongressionalCountdown from './CongressionalCountdown';
import CandidateCard from './CandidateCard';
import Button from '../../Button/Button';
import SelectedCandidateCard from './SelectedCandidateCard';
import styles from '../styles.module.scss';

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
    setSelectedCandidates([...selectedCandidates, politician]);
    setEligibleUnselectedCandidates(eligibleUnselectedCandidates.filter((candidate) => (
      candidate.rawIdentity !== politician.rawIdentity
    )));
    setDidChangeSelectedCandidates(true);
  };

  const unselectCandidate = (politician) => {
    setEligibleUnselectedCandidates([...eligibleUnselectedCandidates, politician]);
    setSelectedCandidates(selectedCandidates.filter((candidate) => (
      candidate.rawIdentity !== politician.rawIdentity
    )));
    setDidChangeSelectedCandidates(true);
  };

  const findPoliticianIndex = (politicians, politician) => {
    const index = politicians.findIndex(({ rawIdentity }) => rawIdentity === politician.rawIdentity);
    return index === -1 ? false : index;
  };

  const moveSelectedCandidate = (politician, direction) => {
    const newSelectedCandidates = [...selectedCandidates];
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
    <Flex vertical gap="20px">
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
        defaultActiveKey={['current', 'preference', 'term']}
        collapsible="icon"
        items={[
          {
            key: 'current',
            label: 'Acting Congressional Assembly',
            children: (
              <CurrentAssemble currentCongressMembers={democracy?.democracy?.currentCongressMembers || []} />
            ),
          },
          termDuration && {
            label: 'Term duration',
            key: 'term',
            children: (
              <CongressionalCountdown termDuration={termDuration.toNumber()} />
            ),
          },
          {
            key: 'preference',
            label: 'Candidates',
            extra: (
              <Flex wrap gap="15px" justify="end">
                <Button
                  primary
                  disabled={!didChangeSelectedCandidates}
                  onClick={() => handleUpdate()}
                >
                  Update vote
                </Button>
                <Button
                  red
                  onClick={() => {
                    setSelectedCandidates([]);
                    setEligibleUnselectedCandidates([
                      ...selectedCandidates,
                      ...eligibleUnselectedCandidates,
                    ]);
                  }}
                >
                  Clear my votes
                </Button>
              </Flex>
            ),
            children: (
              <Flex vertical gap="5px">
                <Divider>
                  Selected candidates
                </Divider>
                <List
                  dataSource={selectedCandidates}
                  locale={{ emptyText: 'No selected candidates' }}
                  renderItem={(currentCandidateVoteByUser, index) => (
                    <List.Item>
                      <SelectedCandidateCard
                        politician={currentCandidateVoteByUser}
                        unselectCandidate={unselectCandidate}
                        moveSelectedCandidate={moveSelectedCandidate}
                        candidateIndex={index}
                        candidatesLength={selectedCandidates.length}
                      />
                    </List.Item>
                  )}
                />
                <Divider>
                  Eligible candidates
                </Divider>
                <List
                  dataSource={eligibleUnselectedCandidates}
                  locale={{ emptyText: 'No eligible candidates' }}
                  renderItem={(unSelectedCandidate) => (
                    <List.Item>
                      <CandidateCard
                        politician={unSelectedCandidate}
                        selectCandidate={selectCandidate}
                      />
                    </List.Item>
                  )}
                />
              </Flex>
            ),
          },
        ].filter(Boolean)}
      />
      <Card
        title={(
          <Title level={4}>
            Unhappy with the way Liberland is run?
          </Title>
        )}
        className={styles.splash}
        actions={[
          <Button
            onClick={() => {
              window.location.href = 'https://docs.liberland.org/primers/congress';
            }}
          >
            Learn how
            <Space />
            <GlobalOutlined />
          </Button>,
        ]}
      >
        <Card.Meta
          description="Help lead the way by registering your candidacy for a seat in Liberland Congress."
        />
      </Card>
    </Flex>
  );
}

export default CongressionalAssemble;
