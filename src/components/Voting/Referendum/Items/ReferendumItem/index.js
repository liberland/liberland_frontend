import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';
import { formatPolkadotBalance } from '../../../../../utils/walletHelpers';

const voteButtons = (buttonVoteCallback, referendumInfo) => (
  <div className={styles.buttonContainer}>
    <Button
      small
      primary
      green
      className={styles.yayButton}
      onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}
    >
      Vote Aye
    </Button>
    <Button
      small
      primary
      red
      className={styles.nayButton}
      onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
    >
      Vote Nay
    </Button>
  </div>
);

const alreadyVotedButton = (alreadyVoted) => (alreadyVoted === 'Aye'
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

function ReferendumItem({
  name, createdBy, externalLink, description, yayVotes, nayVotes, hash,
  alreadyVoted, buttonVoteCallback, votingTimeLeft, referendumIndex,
}) {
  const totalVotes = formatPolkadotBalance(yayVotes) + formatPolkadotBalance(nayVotes);
  const ratio = formatPolkadotBalance(yayVotes) / totalVotes;
  const progressBarRatio = yayVotes > 0 ? `${100 * ratio}%` : '0%';
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
                <span className={styles.yayText}>{formatPolkadotBalance(yayVotes)}</span>
                /
                <span className={styles.nayText}>{formatPolkadotBalance(nayVotes)}</span>
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
            <span className={styles.votingTimeText}>Voting ends in:</span>
            {' '}
            <b>{votingTimeLeft}</b>
          </div>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
        <div className={styles.buttonContainer}>
          {
            alreadyVoted
              ? alreadyVotedButton(alreadyVoted)
              : voteButtons(buttonVoteCallback, { name, referendumIndex })

          }
        </div>
      </div>
    </Card>
  );
}

ReferendumItem.propTypes = {
  name: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  alreadyVoted: PropTypes.string.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  votingTimeLeft: PropTypes.string.isRequired,
  referendumIndex: PropTypes.number.isRequired,
};
export default ReferendumItem;
