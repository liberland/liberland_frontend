import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import cx from 'classnames';
import styles from './styles.module.scss';
import Button from '../../../../Button/Button';
import { formatMerits } from '../../../../../utils/walletHelpers';
import truncate from '../../../../../utils/truncate';
import NotificationPortal from '../../../../NotificationPortal';
// REDUX
import { congressActions } from '../../../../../redux/actions';
import Header from '../Header';
import Details from '../Details';
import { centralizedDatasType } from '../types';
import Discussions from '../Discussions';

const HashIndexType = {
  hash: PropTypes.string.isRequired,
  referendumIndex: PropTypes.number.isRequired,
};

function VoteButtons({ buttonVoteCallback, referendumInfo }) {
  return (
    <>
      <Button
        className={styles.button}
        small
        primary
        green
        onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}
      >
        VOTE AYE
      </Button>
      <Button
        className={styles.button}
        small
        primary
        red
        onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
      >
        VOTE NAY
      </Button>

    </>
  );
}

VoteButtons.propTypes = {
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumInfo: HashIndexType.isRequired,
};

function AlreadyVotedButton({ buttonVoteCallback, referendumInfo, alreadyVoted }) {
  if (alreadyVoted === 'Aye') {
    return (
      <>
        <Button primary small green className={styles.button}>
          YOU VOTED: &nbsp;
          {alreadyVoted.toUpperCase()}
        </Button>
        <Button
          className={styles.button}
          small
          secondary
          red
          onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
        >
          CHANGE VOTE TO NAY
        </Button>
      </>
    );
  }
  return (
    <>
      <Button primary small red className={styles.button}>
        YOU VOTED: &nbsp;
        {alreadyVoted.toUpperCase()}
      </Button>
      <Button
        className={styles.button}
        small
        secondary
        green
        onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}
      >
        CHANGE VOTE TO AYE
      </Button>
    </>
  );
}

AlreadyVotedButton.propTypes = {
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumInfo: HashIndexType.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
};

function VoteButtonsContainer({
  alreadyVoted, delegating, buttonVoteCallback, referendumData,
}) {
  if (alreadyVoted) {
    return (
      <AlreadyVotedButton
        buttonVoteCallback={buttonVoteCallback}
        referendumInfo={referendumData}
        alreadyVoted={alreadyVoted}
      />
    );
  }
  if (delegating) { return <span>Undelegate to vote individually</span>; }

  return (
    <VoteButtons buttonVoteCallback={buttonVoteCallback} referendumInfo={referendumData} />
  );
}

VoteButtonsContainer.propTypes = {
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  delegating: PropTypes.bool.isRequired,
  referendumData: HashIndexType.isRequired,
};

function BlacklistButton({ hash, referendumIndex }) {
  const dispatch = useDispatch();

  const blacklistMotion = () => dispatch(
    congressActions.congressDemocracyBlacklist.call({
      hash,
      referendumIndex,
    }),
  );

  return (
    <Button small secondary onClick={blacklistMotion}>
      CANCEL AS CONGRESS
    </Button>
  );
}

BlacklistButton.propTypes = HashIndexType;

function CounterItem({ votedTotal, votes, isNay }) {
  const text = isNay ? 'Nay' : 'Aye';
  return (
    <div className={styles.counterItem}>
      <div className={cx(styles.circle, styles[`circle${text}`])} />
      <span>{text}</span>
      {' - '}
      <span>{formatMerits(votes)}</span>
      /
      <span>{formatMerits(votedTotal)}</span>
    </div>
  );
}

CounterItem.defaultProps = {
  isNay: false,
};

CounterItem.propTypes = {
  votedTotal: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  isNay: PropTypes.bool,
};

function ReferendumItem({
  centralizedDatas,
  voted,
  hash,
  alreadyVoted,
  buttonVoteCallback,
  referendumIndex,
  delegating,
  proposal,
  blacklistMotion,
  userIsMember,
}) {
  const [isReferendumHidden, setIsReferendumHidden] = useState(true);
  const { yayVotes, nayVotes, votedTotal } = voted;
  const progressBarRatio = yayVotes.gt(BN_ZERO)
    ? `${yayVotes.mul(new BN('100'))
      .div(yayVotes.add(nayVotes)).toString()}%`
    : '0%';
  const notificationRef = useRef();

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.itemWrapper}>
        <Header
          hash={hash}
          setIsHidden={setIsReferendumHidden}
          isHidden={isReferendumHidden}
        >
          <VoteButtonsContainer
            alreadyVoted={alreadyVoted}
            buttonVoteCallback={buttonVoteCallback}
            delegating={delegating}
            referendumData={{ id: hash, referendumIndex }}
          />
          {blacklistMotion && (
            <div className={styles.rowEnd}>
              <small>
                Blacklist motion:
                <a href={`/home/congress/motions#${blacklistMotion}`}>
                  {truncate(blacklistMotion, 13)}
                </a>
              </small>
            </div>
          )}
          {!blacklistMotion && userIsMember
            && (
            <div className={styles.rowEnd}>
              <BlacklistButton
                hash={hash}
                referendumIndex={referendumIndex}
              />
            </div>
            )}
        </Header>
        <div className={styles.metaInfoLine}>
          <div className={styles.votesInfo}>
            <div className={styles.progressBar}>
              <div className={styles.yayProgressBar} style={{ width: progressBarRatio }} />
            </div>
            <div className={styles.votesCount}>
              <CounterItem votedTotal={votedTotal} votes={yayVotes} />
              <CounterItem votedTotal={votedTotal} votes={nayVotes} isNay />
            </div>
          </div>
        </div>
        { !isReferendumHidden
        && (
          <>
            <Details proposal={proposal} isReferendumHidden={isReferendumHidden} />
            <div className={styles.discussionMetaLine}>
              {centralizedDatas?.length > 0
              && (
                <Discussions centralizedDatas={centralizedDatas} />
              )}
            </div>

          </>
        )}

      </div>
    </>
  );
}

const votesTypes = {
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  votedTotal: PropTypes.number.isRequired,
};

ReferendumItem.propTypes = {
  centralizedDatas: PropTypes.arrayOf(centralizedDatasType).isRequired,
  voted: votesTypes.isRequired,
  hash: PropTypes.string.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumIndex: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
  proposal: PropTypes.instanceOf(Map).isRequired,
  userIsMember: PropTypes.bool.isRequired,
};

export default ReferendumItem;
