import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import { blockchainSelectors } from '../../../redux/selectors';
import { readMotion } from '../../../utils/motions';
import Motion from '../Motion';
import Button from '../../Button/Button';
import EmptyState from '../../EmptyState';
import styles from './styles.module.scss';

/*
 * One motion, on its own page.
 *
 * Until now a motion could only be read inside a list of all the others —
 * there was no way to open one, link to one, or send someone to one. The card
 * itself is the same component the list uses, so nothing about the vote is
 * reimplemented here; the page adds the way back and the exact end of the
 * voting period, which only matters when you are looking at a single motion.
 */
function MotionDetail({
  motions, loading, userIsMember, voteMotion, closeMotion, backPath, backLabel,
}) {
  // `motions` starts as an empty array, so "not found" and "not fetched yet"
  // look identical. Claiming a motion is gone while its chamber is still
  // loading is worse than waiting, especially on a deep link where this page
  // is the first thing the app renders.
  const { proposalHash } = useParams();
  const history = useHistory();
  const currentBlock = useSelector(blockchainSelectors.blockNumber);

  const found = (motions || []).find(
    (motion) => motion.proposal?.toString?.() === proposalHash,
  );

  const back = (
    <Button className={styles.back} onClick={() => history.push(backPath)} data-testid="motion-back">
      {backLabel}
    </Button>
  );

  if (!found) {
    return (
      <div className={styles.page}>
        {back}
        {loading || !motions ? <Spin /> : (
          <EmptyState
            title="This motion is no longer open"
            description={'A motion leaves the chain once it has been closed and executed, or closed '
              + 'as rejected. If you followed a link to it, the vote has already been settled.'}
          />
        )}
      </div>
    );
  }

  const read = readMotion(found, currentBlock);

  return (
    <div className={styles.page}>
      {back}
      <Motion
        userIsMember={userIsMember}
        membersCount={found.membersCount}
        proposal={found.proposal.toString()}
        proposalOf={found.proposalOf.unwrap()}
        voting={found.voting.unwrap()}
        voteMotion={voteMotion}
        closeMotion={closeMotion}
      />
      {read.endBlock != null && (
        <p className={styles.endNote}>
          {`Voting ends at block #${read.endBlock.toLocaleString()}`}
          {read.hasExpired ? ' — the period has already ended.' : `, about ${read.timeLeft} from now.`}
        </p>
      )}
    </div>
  );
}

MotionDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  motions: PropTypes.array,
  loading: PropTypes.bool,
  userIsMember: PropTypes.bool,
  voteMotion: PropTypes.func.isRequired,
  closeMotion: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  backLabel: PropTypes.string,
};

MotionDetail.defaultProps = {
  backLabel: 'All motions',
};

export default MotionDetail;
