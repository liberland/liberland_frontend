import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import Card from '../../../../Card';

function DispatchItem({
  name, createdBy, externalLink, description, yayVotes, nayVotes, hash, timeLeftUntilImplemented,
}) {
  const progressBarRatio = yayVotes.gt(BN_ZERO) ? `${yayVotes.mul(new BN("100")).div(yayVotes.add(nayVotes)).toString()}%` : '0%';
  return (
    <Card
      title={name}
      className={styles.referendumItemContainer}
    >
      <div>
        <div className={styles.metaInfoLine}>
          <div>
            <div className={styles.metaTextInfo}>
              By:
              {' '}
              {createdBy}
            </div>
            <div className={styles.hashText}>
              {hash}
            </div>
          </div>
          <div className={styles.votesInfo}>
            <div className={styles.votesCount}>
              <div>
                <span className={styles.yayText}>Yay</span>
                /
                <span className={styles.nayText}>Nay</span>
              </div>
              <div>
                <span className={styles.yayText}>{yayVotes}</span>
                /
                <span className={styles.nayText}>{nayVotes}</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.yayProgressBar} style={{ width: progressBarRatio }} />
            </div>
          </div>
        </div>
        <div className={styles.discussionMetaLine}>
          <div>
            <a href={externalLink}>Read discussion</a>
          </div>
          <div>
            <span className={styles.votingTimeText}>Implements in:</span>
            {' '}
            <b>{timeLeftUntilImplemented}</b>
          </div>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      </div>
    </Card>
  );
}

DispatchItem.propTypes = {
  name: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  timeLeftUntilImplemented: PropTypes.string.isRequired,
};

export default DispatchItem;
