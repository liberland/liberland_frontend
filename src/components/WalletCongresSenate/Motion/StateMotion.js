import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import { Proposal } from '../../Proposal';
import MotionSummary, { MotionHash, MotionStatusTag } from '../MotionSummary';
import ProposalErrorBoundary from '../MotionSummary/ProposalErrorBoundary';
import styles from './state.module.scss';

/*
 * A motion in the Liberland State design language: a hairline card with the
 * tally drawn as seats, the threshold marked on the bar, the time left, and
 * what passing it would actually do.
 *
 * This is markup only. Whether the motion can be closed, whether this member
 * has already voted and what each button dispatches are computed by
 * useMotionActions in Motion and passed in, so the two languages cannot drift
 * on anything that touches the chain.
 */
function StateMotion({
  motion,
  userIsMember,
  canVoteAye,
  canVoteNay,
  onVote,
  onCloseExecute,
  onCloseRejected,
}) {
  return (
    <article className={styles.motion}>
      <header className={styles.head}>
        <span className={styles.reference}>{`Motion #${motion.index}`}</span>
        <MotionStatusTag status={motion.status} />
      </header>

      <h3 className={styles.title}>{motion.title}</h3>

      <div className={styles.body}>
        <ProposalErrorBoundary hash={motion.hash}>
          <Proposal proposal={motion.call} isDetailsHidden />
        </ProposalErrorBoundary>
      </div>

      <MotionHash hash={motion.hash} />

      <MotionSummary motion={motion} showFateDetail />

      {userIsMember && (
        <div className={styles.actions}>
          {motion.isClosable && (
            <Button primary onClick={onCloseExecute}>Close &amp; execute</Button>
          )}
          {canVoteAye && (
            <Button onClick={() => onVote(true)}>Vote aye</Button>
          )}
          {canVoteNay && (
            <Button onClick={() => onVote(false)}>Vote nay</Button>
          )}
          {motion.isClosableNaye && (
            <Button primary onClick={onCloseRejected}>Close motion</Button>
          )}
        </div>
      )}
    </article>
  );
}

StateMotion.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  motion: PropTypes.object.isRequired,
  userIsMember: PropTypes.bool.isRequired,
  canVoteAye: PropTypes.bool.isRequired,
  canVoteNay: PropTypes.bool.isRequired,
  onVote: PropTypes.func.isRequired,
  onCloseExecute: PropTypes.func.isRequired,
  onCloseRejected: PropTypes.func.isRequired,
};

export default StateMotion;
