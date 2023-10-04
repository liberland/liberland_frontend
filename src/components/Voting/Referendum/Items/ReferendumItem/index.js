import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';
import { formatMerits } from '../../../../../utils/walletHelpers';
import { BN, BN_ZERO } from '@polkadot/util';

const voteButtons = (buttonVoteCallback, referendumInfo) => (
  <div className={styles.buttonContainer}>
    <Button
      medium
      primary
      green
      className={styles.yayButton}
      onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}>
      Vote Aye
    </Button>
    <Button
      medium
      primary
      red
      className={styles.nayButton} onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}>
      Vote Nay
    </Button>
  </div>
);

const alreadyVotedButton = (buttonVoteCallback, referendumInfo, alreadyVoted) => (
  <div className={styles.buttonContainer}>
    {alreadyVoted === 'Aye'
      ? (
        <>
          <Button primary medium green className={styles.yayButton}>
            You voted: &nbsp;
            {alreadyVoted}
          </Button>
          <Button
            medium
            secondary
            red
            className={styles.nayButton}
            onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}>
            Change vote to Nay
          </Button>
        </>
      )
      : (
        <>
          <Button primary medium red className={styles.yayButton}>
            You voted: &nbsp;
            {alreadyVoted}
          </Button>
          <Button
            medium secondary green className={styles.nayButton} onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}>Change vote to Aye</Button>
        </>
      )}
  </div>
);

function ReferendumItem({
  name, createdBy, externalLink, description, yayVotes, nayVotes, hash, alreadyVoted, buttonVoteCallback, votingTimeLeft, referendumIndex, delegating,
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
                <span className={styles.yayText}>{formatMerits(yayVotes)}</span>
                /
                <span className={styles.nayText}>{formatMerits(nayVotes)}</span>
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
            (alreadyVoted
              ? alreadyVotedButton(buttonVoteCallback, { name, referendumIndex }, alreadyVoted)
              : (
                delegating
                  ? 'Undelegate to vote individually'
                  : voteButtons(buttonVoteCallback, { name, referendumIndex })
              )
            )

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
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  votingTimeLeft: PropTypes.string.isRequired,
  referendumIndex: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
};

export default ReferendumItem;
