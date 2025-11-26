/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { useMediaQuery } from 'usehooks-ts';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import { democracyActions } from '../../../redux/actions';
import CandidateCard from './CandidateCard';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';

function Candidates() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const isLargeScreen = useMediaQuery('(min-width: 1600px)');
  const isVeryLargeScreen = useMediaQuery('(min-width: 1920px)');

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch, userWalletAddress]);

  const handleUpdate = (selected) => {
    dispatch(democracyActions.voteForCongress.call({ selectedCandidates: selected, userWalletAddress }));
  };

  const { selectedCandidates, eligibleUnselectedCandidates } = useMemo(() => {
    const {
      currentCongressMembers, candidates, runnersUp, currentCandidateVotesByUser,
    } = democracy?.democracy || {};

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
    return {
      selectedCandidates: currentCandidateVotesByUser,
      eligibleUnselectedCandidates: filteredEligibleUnselectedCandidates,
    };
  }, [democracy]);

  const selectCandidate = (politician) => {
    const newList = [...selectedCandidates, politician];
    handleUpdate(newList);
  };

  useEffect(() => {

  }, [democracy]);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

  const clearButton = eligibleUnselectedCandidates?.length > 0 ? (
    <Button
      red
      onClick={() => {
        handleUpdate([]);
      }}
    >
      Clear my votes
    </Button>
  ) : null;

  return (
    <Flex vertical gap="24px">
      <Flex justify="space-between" gap="24px" align="center">
        <Title level={2}>
          Candidates
        </Title>
        {isBiggerThanSmallScreen && clearButton}
      </Flex>
      {!isBiggerThanSmallScreen && clearButton}
      <Paragraph className={styles.paragraph}>
        This page allows citizens to
        {' '}
        <strong>cast their vote for representatives of the Liberland Congressional Assembly</strong>
        {' '}
        , ensuring that every vote reflects the voter’s prioritized choice within the nation’s representative framework.
      </Paragraph>
      <Flex vertical gap="8px">
        <List
          dataSource={eligibleUnselectedCandidates}
          locale={{ emptyText: <div className={styles.none}>No eligible candidates found</div> }}
          className="compactList"
          split={false}
          bordered={false}
          grid={isLargeScreen ? { column: isVeryLargeScreen ? 4 : 2 } : undefined}
          renderItem={(unSelectedCandidate) => (
            <List.Item>
              <CandidateCard
                politician={unSelectedCandidate}
                selectCandidate={selectCandidate}
              />
            </List.Item>
          )}
        />
        <div>
          {clearButton}
        </div>
      </Flex>
    </Flex>
  );
}

export default Candidates;
