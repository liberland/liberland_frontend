import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { blockchainSelectors } from '../../../redux/selectors';
import { MOTION_FILTERS, countByStatus, sortMotionsNewestFirst } from '../../../utils/motions';
import { Proposal } from '../../Proposal';
import MotionSummary, { MotionHash, MotionStatusTag } from '../MotionSummary';
import ProposalErrorBoundary from '../MotionSummary/ProposalErrorBoundary';
import EmptyState from '../../EmptyState';
import styles from './styles.module.scss';

/*
 * The motions of a chamber, as a board you can actually read.
 *
 * What it fixes, in order of how much it hurt:
 *
 *  - Motions arrived in `council.proposals()` storage order, which is neither
 *    chronological nor stable. They are now newest first, by the chain's own
 *    motion index.
 *  - Decided and undecided motions were mixed together with nothing to tell
 *    them apart. Each now carries its status, and the board can be narrowed
 *    to one status at a time, with counts so nothing is silently hidden.
 *  - The tally, the threshold and the time remaining were not shown at all.
 *  - The proposal hash was truncated to its first and last characters, which
 *    is not an identifier — two motions can share them. It is shown in full
 *    and copies on click.
 *  - There was no way to open a single motion. Each row now links to one.
 *
 * Shared by Congress and the Senate, and by both design languages: the
 * colours and type come from the design tokens.
 */
function MotionsBoard({ motions, detailPath, emptyText }) {
  const history = useHistory();
  const currentBlock = useSelector(blockchainSelectors.blockNumber);
  const [filter, setFilter] = useState('all');

  const read = useMemo(
    () => sortMotionsNewestFirst(motions, currentBlock),
    [motions, currentBlock],
  );
  const counts = useMemo(() => countByStatus(read), [read]);
  const shown = useMemo(
    () => (filter === 'all' ? read : read.filter((m) => m.status.key === filter)),
    [read, filter],
  );

  if (!read.length) {
    return <EmptyState title={emptyText} />;
  }

  const open = (hash) => history.push(detailPath(hash));

  return (
    <div className={styles.board}>
      <div className={styles.filters} role="group" aria-label="Filter motions by status">
        {MOTION_FILTERS.map(({ key, label }) => {
          const count = counts[key] || 0;
          if (key !== 'all' && !count) return null;
          return (
            <button
              key={key}
              type="button"
              className={`${styles.filter} ${filter === key ? styles.filterOn : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              data-testid={`motion-filter-${key}`}
            >
              {label}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
        <span className={styles.ordering}>Newest first</span>
      </div>

      <ul className={styles.rows}>
        {shown.map((motion) => (
          <li key={motion.hash}>
            <div
              className={styles.row}
              role="link"
              tabIndex={0}
              aria-label={`Open motion ${motion.index}`}
              data-testid={`motion-row-${motion.index}`}
              onClick={() => open(motion.hash)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  open(motion.hash);
                }
              }}
            >
              <div className={styles.rowHead}>
                <span className={styles.rowIndex}>{`Motion #${motion.index}`}</span>
                <MotionStatusTag status={motion.status} />
              </div>

              <div className={styles.rowBody}>
                <ProposalErrorBoundary hash={motion.hash}>
                  <Proposal proposal={motion.call} isTableRow isDetailsHidden />
                </ProposalErrorBoundary>
              </div>

              <MotionHash hash={motion.hash} />

              <MotionSummary motion={motion} />
            </div>
          </li>
        ))}
      </ul>

      {!shown.length && (
        <p className={styles.noneInFilter}>
          {`No motions are ${MOTION_FILTERS.find((f) => f.key === filter)?.label.toLowerCase()}.`}
        </p>
      )}
    </div>
  );
}

MotionsBoard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  motions: PropTypes.array,
  detailPath: PropTypes.func.isRequired,
  emptyText: PropTypes.string,
};

MotionsBoard.defaultProps = {
  emptyText: 'There are no open motions',
};

export default MotionsBoard;
