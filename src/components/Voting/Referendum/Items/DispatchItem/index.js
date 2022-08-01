import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';

const DispatchItem = ({
  name, createdBy, externalLink, description, yayVotes, nayVotes, hash, timeLeftUntilImplemented
}) => {
  const progressBarRatio = yayVotes > 0 ? `${((yayVotes) / (yayVotes + nayVotes)) * 100}%` : '0%';
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
            <span className={styles.votingTimeText}>Implements in:</span> <b>{timeLeftUntilImplemented}</b>
          </div>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      </div>
    </Card>
  );
};
export default DispatchItem;
