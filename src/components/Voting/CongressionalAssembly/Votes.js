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
import SelectedCandidateCard from './SelectedCandidateCard';
import styles from '../styles.module.scss';
import ReoderVotesModal from '../../Modals/ReoderVotesModal';

function Votes() {
  const dispatch = useDispatch();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch, userWalletAddress]);

  const selectedCandidates = useMemo(() => {
    const {
      currentCandidateVotesByUser,
    } = democracy?.democracy || {};
    return currentCandidateVotesByUser;
  }, [democracy]);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

  return (
    <Flex vertical gap="24px">
      <Flex justify="space-between" gap="24px" align="center">
        <Title level={2}>
          Candidates
        </Title>
        {isBiggerThanSmallScreen
          && selectedCandidates?.length > 0
          && <ReoderVotesModal candidates={selectedCandidates} />}
      </Flex>
      {!isBiggerThanSmallScreen
        && selectedCandidates?.length > 0
        && <ReoderVotesModal candidates={selectedCandidates} />}
      <Paragraph className={styles.paragraph}>
        This page allows citizens to
        {' '}
        <strong>rank-order their votes for representatives of the Liberland Congressional Assembly</strong>
      </Paragraph>
      <Flex vertical gap="8px">
        <List
          dataSource={selectedCandidates}
          split={false}
          bordered={false}
          locale={{ emptyText: <div className={styles.none}>No candidates were selected</div> }}
          grid={{ column: 1 }}
          renderItem={(currentCandidateVoteByUser, index) => (
            <List.Item>
              <SelectedCandidateCard
                politician={currentCandidateVoteByUser}
                candidateIndex={index}
                candidatesLength={selectedCandidates.length}
              />
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
}

export default Votes;
