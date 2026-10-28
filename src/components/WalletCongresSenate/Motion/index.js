import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Button from '../../Button/Button';
import { Proposal } from '../../Proposal';
import { blockchainSelectors } from '../../../redux/selectors';
import Voters from '../Voters';
import ProposalTable from '../../Proposal/ProposalTable';
import MotionSummary, { MotionHash, MotionStatusTag } from '../MotionSummary';
import ProposalErrorBoundary from '../MotionSummary/ProposalErrorBoundary';
import useMotionTitle from '../MotionSummary/useMotionTitle';
import { readMotion } from '../../../utils/motions';
import StateMotion from './StateMotion';
import useMotionActions from './useMotionActions';
import { useModeContext } from '../../AntdProvider';
import styles from './styles.module.scss';

export default function Motion({
  proposal,
  proposalOf,
  voting,
  voteMotion,
  closeMotion,
  membersCount,
  userIsMember,
  isTableRow,
}) {
  const { isStateDesign } = useModeContext();
  const currentBlock = useSelector(blockchainSelectors.blockNumber);
  const actions = useMotionActions({
    proposal, voting, voteMotion, closeMotion, membersCount,
  });
  const {
    isClosable, isClosableNaye, canVoteAye, canVoteNay,
  } = actions;

  // The same reading both languages and the motion's own page use, so a
  // motion cannot read "passing" on one screen and "voting" on another.
  const motion = readMotion({
    proposal, proposalOf, voting, membersCount,
  }, currentBlock);
  const title = useMotionTitle(motion);

  // The State language draws a motion as a hairline card. Every decision
  // above is shared, so only the markup differs.
  if (isStateDesign) {
    return (
      <StateMotion
        motion={motion}
        userIsMember={userIsMember}
        canVoteAye={canVoteAye}
        canVoteNay={canVoteNay}
        onVote={actions.vote}
        onCloseExecute={actions.closeExecute}
        onCloseRejected={actions.closeRejected}
      />
    );
  }

  return (
    <Card
      title={(
        <Flex vertical gap="6px" className={styles.cardTitle}>
          <Flex wrap align="center" gap="10px">
            <span className={styles.cardIndex}>{`Motion #${motion.index}`}</span>
            <MotionStatusTag status={motion.status} />
          </Flex>
          <span className={styles.cardSubject}>{title}</span>
        </Flex>
      )}
      className={styles.fullWidth}
      actions={userIsMember ? [
        <Flex wrap gap="15px" justify="start" className={styles.actions}>
          {isClosable && (
            <Button primary onClick={actions.closeExecute}>
              Close &amp; Execute
            </Button>
          )}
          {canVoteNay && (
            <Button onClick={() => actions.vote(false)} red>
              Vote nay
            </Button>
          )}
          {canVoteAye && (
            <Button onClick={() => actions.vote(true)} green>
              Vote aye
            </Button>
          )}
          {isClosableNaye && (
            <Button onClick={actions.closeRejected} primary>
              Close Motion
            </Button>
          )}
        </Flex>,
      ] : []}
    >
      <Flex vertical gap="15px">
        <MotionSummary motion={motion} showFateDetail />
        <MotionHash hash={motion.hash} />
        <ProposalErrorBoundary hash={motion.hash}>
          <Proposal proposal={proposalOf} isTableRow={isTableRow} isDetailsHidden />
        </ProposalErrorBoundary>
        <Flex wrap gap="15px">
          <Card size="small" title="Voted aye">
            <Voters voting={voting.ayes} />
          </Card>
          <Card size="small" title="Voted nay">
            <Voters voting={voting.nays} />
          </Card>
        </Flex>
        <ProposalTable />
      </Flex>
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
Motion.propTypes = {
  proposal: PropTypes.string.isRequired,
  proposalOf: PropTypes.shape({
    args: PropTypes.array.isRequired,
    method: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    toHuman: PropTypes.func.isRequired,
  }).isRequired,
  voting: PropTypes.shape({
    index: PropTypes.object.isRequired,
    threshold: PropTypes.object.isRequired,
    ayes: PropTypes.arrayOf(PropTypes.object).isRequired,
    nays: PropTypes.arrayOf(PropTypes.object).isRequired,
    end: PropTypes.object.isRequired,
  }).isRequired,
  closeMotion: PropTypes.func.isRequired,
  voteMotion: PropTypes.func.isRequired,
  membersCount: PropTypes.number.isRequired,
  isTableRow: PropTypes.bool,
  userIsMember: PropTypes.bool.isRequired,
};
