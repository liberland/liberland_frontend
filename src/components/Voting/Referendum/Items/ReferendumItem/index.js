import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';
import { formatMerits } from '../../../../../utils/walletHelpers';
import truncate from '../../../../../utils/truncate';
import NotificationPortal from '../../../../NotificationPortal';
import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copy.svg';
import useUsersIdentity from '../../../../../hooks/useUsersIdentity';
import { findNameOrId } from '../../../../../utils/getNameOrId';

// REDUX
import { congressActions } from '../../../../../redux/actions';
import {
  congressSelectors,
} from '../../../../../redux/selectors';
import { Proposal } from '../../../../Proposal';

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
            onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
          >
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
            medium
            secondary
            green
            className={styles.nayButton}
            onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}
          >
            Change vote to Aye
          </Button>
        </>
      )}
  </div>
);

const voteButtonsContainer = (alreadyVoted, delegating, buttonVoteCallback, referendumData) => {
  if (alreadyVoted) { return alreadyVotedButton(buttonVoteCallback, referendumData, alreadyVoted); }
  if (delegating) { return 'Undelegate to vote individually'; }
  return voteButtons(buttonVoteCallback, referendumData);
};

function BlacklistButton({ hash, referendumIndex }) {
  const dispatch = useDispatch();
  const userIsMember = useSelector(congressSelectors.userIsMember);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  if (!userIsMember) return null;

  const blacklistMotion = () => dispatch(
    congressActions.congressDemocracyBlacklist.call({
      hash,
      referendumIndex,
    }),
  );

  return (
    <Button small secondary onClick={() => { blacklistMotion(); }}>
      Cancel
    </Button>
  );
}

BlacklistButton.propTypes = {
  hash: PropTypes.string.isRequired,
  referendumIndex: PropTypes.number.isRequired,
};

function ReferendumItem({
  centralizedDatas,
  yayVotes,
  nayVotes,
  hash,
  alreadyVoted,
  buttonVoteCallback,
  votingTimeLeft,
  referendumIndex,
  delegating,
  proposal,
  blacklistMotion,
}) {
  const progressBarRatio = yayVotes.gt(BN_ZERO)
    ? `${yayVotes.mul(new BN('100'))
      .div(yayVotes.add(nayVotes)).toString()}%`
    : '0%';
  const notificationRef = useRef();
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  const proposersList = centralizedDatas.map((item) => item.proposerAddress);
  const { usersList } = useUsersIdentity(proposersList);

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <Card
        title={(
          <>
            ID:
            {truncate(hash, 20)}
            {' '}
            <CopyIcon className={styles.copyIcon} name="proposalHash" onClick={() => handleCopyClick(hash)} />
          </>
)}
        className={styles.referendumItemContainer}
      >
        <div>
          <div className={styles.rowEnd}>
            {blacklistMotion ? (
              <small>
                Blacklist motion:
                <a href={`/home/congress/motions#${blacklistMotion}`}>
                  {truncate(blacklistMotion, 13)}
                </a>
              </small>
            )
              : (
                <BlacklistButton
                  hash={hash}
                  referendumIndex={referendumIndex}
                />
              )}
          </div>
          <div className={styles.metaInfoLine}>
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
          <div>
            Details:
            <Proposal {...{ proposal }} />
          </div>
          <div className={styles.discussionMetaLine}>
            {centralizedDatas?.length > 0
              && (
              <div>
                Discussions:
                <ol>
                  {centralizedDatas.map((centralizedData) => {
                    const proposedDiscussionName = findNameOrId(centralizedData.proposerAddress, usersList);
                    return (
                      <li key={centralizedData.id}>
                        <a href={centralizedData.link}>
                          {centralizedData.name}
                        </a>
                        {' - '}
                        {centralizedData.description}
                        {' '}
                        (Discussion addede by
                        {' '}
                        <b>{ proposedDiscussionName }</b>
                        <CopyIcon
                          className={styles.copyIcon}
                          name="walletAddress"
                          onClick={() => handleCopyClick(centralizedData.proposerAddress)}
                        />
                        )
                      </li>
                    );
                  })}
                </ol>
              </div>
              )}
            <div>
              <span className={styles.votingTimeText}>Voting ends in:</span>
              {' '}
              <b>{votingTimeLeft}</b>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            {
              voteButtonsContainer(alreadyVoted, delegating, buttonVoteCallback, { id: hash, referendumIndex })
            }
          </div>
        </div>
      </Card>
    </>
  );
}

ReferendumItem.propTypes = {
  centralizedDatas: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    proposerAddress: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  votingTimeLeft: PropTypes.string.isRequired,
  referendumIndex: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
  proposal: PropTypes.instanceOf(Map).isRequired,
};

export default ReferendumItem;
