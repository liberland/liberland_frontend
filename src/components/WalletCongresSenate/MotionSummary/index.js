import React from 'react';
import PropTypes from 'prop-types';
import notification from 'antd/es/notification';
import styles from './styles.module.scss';

/*
 * The tally of a motion, drawn the same way everywhere.
 *
 * One seat, one cell: green for an aye, rust for a nay, an outline for a
 * member who has not voted. The threshold is marked on the bar itself, so
 * "4 of 7" is something you can see rather than something you have to work
 * out. Colour is never the only carrier — every figure is also written out.
 *
 * Both design languages use this; the colours come from the design tokens, so
 * it takes on whichever language is active without a second implementation.
 */

function VoteBar({
  ayes, nays, seats, threshold,
}) {
  const cells = Math.max(seats, ayes + nays, 1);
  const thresholdPercent = cells > 0 ? (threshold / cells) * 100 : 0;

  return (
    <div
      className={styles.bar}
      role="img"
      aria-label={`${ayes} in favour, ${nays} against, of ${seats} seats. Threshold ${threshold}.`}
    >
      <span className={styles.cells} aria-hidden="true">
        {Array.from({ length: cells }, (_, i) => {
          let tone = styles.cellEmpty;
          if (i < ayes) tone = styles.cellAye;
          else if (i < ayes + nays) tone = styles.cellNay;
          return <span key={i} className={`${styles.cell} ${tone}`} />;
        })}
      </span>
      {threshold > 0 && threshold <= cells && (
        <span
          className={styles.thresholdMark}
          style={{ left: `${thresholdPercent}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

VoteBar.propTypes = {
  ayes: PropTypes.number.isRequired,
  nays: PropTypes.number.isRequired,
  seats: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
};

export function MotionHash({ hash }) {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <button
        type="button"
        className={styles.hash}
        title="Copy the full proposal hash"
        data-testid="motion-hash"
        onClick={(event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(hash);
          api.success({ message: 'Proposal hash copied' });
        }}
      >
        {hash}
      </button>
    </>
  );
}

MotionHash.propTypes = { hash: PropTypes.string.isRequired };

export function MotionStatusTag({ status }) {
  return (
    <span
      className={`${styles.status} ${styles[`status_${status.key}`]}`}
      title={status.hint}
      data-testid="motion-status"
    >
      {status.label}
    </span>
  );
}

MotionStatusTag.propTypes = {
  status: PropTypes.shape({ key: PropTypes.string, label: PropTypes.string, hint: PropTypes.string }).isRequired,
};

function MotionSummary({ motion, showFateDetail }) {
  const {
    ayes, nays, seats, threshold, timeLeft, hasExpired, fate, index,
  } = motion;

  return (
    <div className={styles.summary}>
      <VoteBar ayes={ayes.length} nays={nays.length} seats={seats} threshold={threshold} />

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>In favour</dt>
          <dd className={styles.aye}>{ayes.length}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Against</dt>
          <dd className={styles.nay}>{nays.length}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Threshold</dt>
          <dd>{`${threshold} of ${seats}`}</dd>
        </div>
        <div className={styles.fact}>
          <dt>{hasExpired ? 'Voting period' : 'Time left'}</dt>
          <dd>{timeLeft ?? '—'}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Motion</dt>
          <dd>{`#${index}`}</dd>
        </div>
      </dl>

      <div className={styles.fate}>
        <span className={styles.fateLabel}>If it passes</span>
        <span className={styles.fateValue}>{fate.label}</span>
      </div>
      {showFateDetail && <p className={styles.fateDetail}>{fate.detail}</p>}
    </div>
  );
}

MotionSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  motion: PropTypes.object.isRequired,
  showFateDetail: PropTypes.bool,
};

export default MotionSummary;
