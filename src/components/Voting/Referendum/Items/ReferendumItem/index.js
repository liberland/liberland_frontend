import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';

const voteButtons = (buttonVoteCallback, referendumInfo) => (
  <div className={styles.buttonContainer}>
    <Button small primary green className={styles.yayButton} onClick={() => { buttonVoteCallback('Yay', referendumInfo); }}>Vote Yay</Button>
    <Button small primary red className={styles.nayButton} onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}>Vote Nay</Button>
  </div>
);

const alreadyVotedButton = (alreadyVoted) => (alreadyVoted === 'Yay'
  ? (
    <Button medium green>
      You voted: &nbsp;
      {alreadyVoted}
    </Button>
  )
  : (
    <Button medium red>
      You voted: &nbsp;
      {alreadyVoted}
    </Button>
  ));

const ReferendumItem = ({
  name, createdBy, externalLink, description, yayVotes, nayVotes, hash, alreadyVoted, buttonVoteCallback, votingTimeLeft
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
            <span className={styles.votingTimeText}>Voting ends in:</span> <b>{votingTimeLeft}</b>
          </div>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
        <div className={styles.buttonContainer}>
          {
            alreadyVoted
              ? alreadyVotedButton(alreadyVoted)
              : voteButtons(buttonVoteCallback, { name })

          }
        </div>
      </div>
    </Card>
  );
};
export default ReferendumItem;
