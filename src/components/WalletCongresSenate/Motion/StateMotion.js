import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import truncate from '../../../utils/truncate';
import { Proposal } from '../../Proposal';
import styles from './state.module.scss';

/*
 * A motion, as the Liberland State design language draws it: a hairline card
 * with a mono reference and a status, the proposal itself, then the tally as a
 * row of cells — one per seat, filled green for an aye and rust for a nay —
 * beside the counts.
 *
 * This is markup only. Every decision shown here — whether the motion can be
 * closed, whether this member has already voted, what a vote dispatches — is
 * computed by Motion and passed in, so the two languages cannot drift on
 * anything that touches the chain.
 */

function Tally({
  ayes, nays, seats, threshold,
}) {
  const cells = Math.max(seats, ayes + nays);
  return (
    <div className={styles.tally}>
      <span className={styles.cells} aria-hidden="true">
        {Array.from({ length: cells }, (_, index) => {
          let tone = styles.cellEmpty;
          if (index < ayes) tone = styles.cellAye;
          else if (index < ayes + nays) tone = styles.cellNay;
          return <span key={index} className={`${styles.cell} ${tone}`} />;
        })}
      </span>
      <span className={styles.counts}>
        {`${ayes} aye · ${nays} nay · threshold ${threshold}`}
      </span>
    </div>
  );
}

Tally.propTypes = {
  ayes: PropTypes.number.isRequired,
  nays: PropTypes.number.isRequired,
  seats: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
};

function StateMotion({
  proposal,
  proposalOf,
  voting,
  threshold,
  membersCount,
  isClosable,
  isClosableNaye,
  userIsMember,
  userHasVotedAye,
  userHasVotedNay,
  onVote,
  onCloseExecute,
  onCloseRejected,
}) {
  let status = 'Voting';
  let statusClass = styles.statusVoting;
  if (isClosable) {
    status = 'Ready to close';
    statusClass = styles.statusReady;
  } else if (isClosableNaye) {
    status = 'Rejected';
    statusClass = styles.statusRejected;
  }

  return (
    <article className={styles.motion}>
      <header className={styles.head}>
        <span className={styles.reference}>{`Motion ${truncate(proposal, 13)}`}</span>
        <span className={`${styles.status} ${statusClass}`}>{status}</span>
      </header>

      <div className={styles.body}>
        <Proposal proposal={proposalOf} isDetailsHidden />
      </div>

      <Tally
        ayes={voting.ayes.length}
        nays={voting.nays.length}
        seats={membersCount}
        threshold={threshold}
      />

      {userIsMember && (
        <div className={styles.actions}>
          {isClosable && (
            <Button primary onClick={onCloseExecute}>Close &amp; execute</Button>
          )}
          {!userHasVotedAye && !isClosable && (
            <Button onClick={() => onVote(true)}>Vote aye</Button>
          )}
          {!userHasVotedNay && !isClosable && (
            <Button onClick={() => onVote(false)}>Vote nay</Button>
          )}
          {isClosableNaye && (
            <Button primary onClick={onCloseRejected}>Close motion</Button>
          )}
        </div>
      )}
    </article>
  );
}

/* eslint-disable react/forbid-prop-types */
StateMotion.propTypes = {
  proposal: PropTypes.string.isRequired,
  proposalOf: PropTypes.object.isRequired,
  voting: PropTypes.object.isRequired,
  threshold: PropTypes.number.isRequired,
  membersCount: PropTypes.number.isRequired,
  isClosable: PropTypes.bool.isRequired,
  isClosableNaye: PropTypes.bool.isRequired,
  userIsMember: PropTypes.bool.isRequired,
  userHasVotedAye: PropTypes.bool.isRequired,
  userHasVotedNay: PropTypes.bool.isRequired,
  onVote: PropTypes.func.isRequired,
  onCloseExecute: PropTypes.func.isRequired,
  onCloseRejected: PropTypes.func.isRequired,
};

export default StateMotion;
