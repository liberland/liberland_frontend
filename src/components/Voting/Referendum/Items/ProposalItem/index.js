import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import NotificationPortal from '../../../../NotificationPortal';
import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copy.svg';

// REDUX
import { congressActions } from '../../../../../redux/actions';
import {
  congressSelectors,
} from '../../../../../redux/selectors';
import { Preimage } from '../../../../Proposal';

function BlacklistButton({ hash }) {
  const dispatch = useDispatch();
  const userIsMember = useSelector(congressSelectors.userIsMember);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  if (!userIsMember) return null;

  const blacklistMotion = () => {
    dispatch(congressActions.congressDemocracyBlacklist.call({ hash }));
  };

  return (
    <Button small secondary onClick={blacklistMotion}>
      Cancel
    </Button>
  );
}

BlacklistButton.propTypes = { hash: PropTypes.string.isRequired };

const LegacyHash = ({ hash }) => hash;

const Inline = () => 'Inline call';

const Lookup = ({ hash }) => hash;

function BoundedCall({ call, handleCopyClick }) {
  if ('Legacy' in call) {
    return (
      <>
        <LegacyHash hash={truncate(call.Legacy.hash_, 13)} />
        <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={() => handleCopyClick(call.Legacy.hash_)} />
      </>
    );
  } if ('Inline' in call) {
    // eslint-disable-next-line no-console
    console.warn('Inline call details:', call);
    return <Inline />;
  } if ('Lookup' in call) {
    return (
      <>
        <Lookup hash={truncate(call.Lookup.hash_, 13)} />
        <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={() => handleCopyClick(call.Lookup.hash_)} />
      </>
    );
  }
  // eslint-disable-next-line no-console
  console.warn('Unknown call details:', call);
  return 'Unknown type of call.';
}

function EndorseButton({ buttonEndorseCallback, userDidEndorse, referendumInfo }) {
  return userDidEndorse ? (
    <Button medium gray>
      Already endorsed
    </Button>
  )
    : (
      <Button medium primary onClick={() => { buttonEndorseCallback(referendumInfo); }}>
        Endorse
      </Button>
    );
}

EndorseButton.propTypes = {
  buttonEndorseCallback: PropTypes.func.isRequired,
  userDidEndorse: PropTypes.bool.isRequired,
  referendumInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    proposalIndex: PropTypes.string.isRequired,
  }).isRequired,

};

function ProposalItem({
  name,
  createdBy,
  currentEndorsement,
  externalLink,
  description,
  userDidEndorse,
  boundedCall,
  buttonEndorseCallback,
  proposalIndex,
  blacklistMotion,
}) {
  let hash; let
    len;
  if ('Lookup' in boundedCall) {
    hash = boundedCall.Lookup.hash_;
    len = boundedCall.Lookup.len;
  }

  const notificationRef = useRef();
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <Card
        title={name}
        className={styles.cardProposalsSection}
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
                <BlacklistButton hash={
                boundedCall?.Lookup?.hash_
                ?? boundedCall?.Legacy?.hash_
              }
                />
              )}
          </div>
          <div className={styles.metaInfoLine}>
            <div>
              <div className={styles.metaTextInfo}>
                By:
                <b>{ createdBy && truncate(createdBy, 13) }</b>
                <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={() => handleCopyClick(createdBy)} />
              </div>
              <div className={styles.hashText}>
                <b><BoundedCall call={boundedCall} handleCopyClick={handleCopyClick} /></b>
              </div>
            </div>
            <div>
              Endorsement:
              {' '}
              {currentEndorsement}
            </div>
          </div>
          <div>
            <a href={externalLink}>Read discussion</a>
          </div>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
          { hash && len
            && (
            <div>
              Details:
              <Preimage {...{ hash, len }} />
            </div>
            )}
          <div className={styles.buttonContainer}>
            <EndorseButton
              buttonEndorseCallback={buttonEndorseCallback}
              userDidEndorse={userDidEndorse}
              referendumInfo={{ name, proposalIndex }}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

const call = PropTypes.oneOfType([
  PropTypes.shape({
    Legacy: PropTypes.shape({
      hash_: PropTypes.string.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    Lookup: PropTypes.shape({
      hash_: PropTypes.string.isRequired,
      len: PropTypes.number.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    Inline: PropTypes.any.isRequired,
  }),
]);

BoundedCall.propTypes = { call: call.isRequired, handleCopyClick: PropTypes.func.isRequired };

ProposalItem.propTypes = {
  name: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  currentEndorsement: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  userDidEndorse: PropTypes.bool.isRequired,
  boundedCall: call.isRequired,
  buttonEndorseCallback: PropTypes.func.isRequired,
  proposalIndex: PropTypes.string.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
};

export default ProposalItem;
