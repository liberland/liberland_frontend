import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import NotificationPortal from '../../../../NotificationPortal';
import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copy.svg';
import sanitizeUrlHelper from '../../../../../utils/sanitizeUrlHelper';

// REDUX
import { congressActions } from '../../../../../redux/actions';
import { congressSelectors } from '../../../../../redux/selectors';
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

function ProposalItem({
  usersList,
  proposer,
  centralizedDatas,
  boundedCall,
  blacklistMotion,
}) {
  let hash;
  let len;
  if ('Lookup' in boundedCall) {
    hash = boundedCall.Lookup.hash_;
    len = boundedCall.Lookup.len;
  } else if ('Legacy' in boundedCall) {
    hash = boundedCall.Legacy.hash_;
  } else {
    // this sux but we have no other way until we refactor it to NOT use toJSON/toHuman
    hash = blake2AsHex(hexToU8a(boundedCall.Inline));
  }

  const notificationRef = useRef();
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  const nameOrIdProposer = usersList[proposer] || proposer;

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <Card
        title={(
          <>
            ID:
            {truncate(hash, 13)}
            {' '}
            <CopyIcon className={styles.copyIcon} name="proposalHash" onClick={() => handleCopyClick(hash)} />
          </>
)}
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
                Proposed by:
                <b>{ nameOrIdProposer }</b>
                <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={() => handleCopyClick(proposer)} />
              </div>
            </div>
          </div>
          { hash && len
            && (
            <div>
              Details:
              <Preimage {...{ hash, len }} />
            </div>
            )}
          {centralizedDatas?.length > 0
            && (
            <div>
              Discussions:
              <ol>
                {centralizedDatas.map((centralizedData) => {
                  const nameOrId = usersList[centralizedData.proposerAddress]
                   || truncate(centralizedData.proposerAddress, 13);
                  const sanitizeUrl = sanitizeUrlHelper(centralizedData.link);
                  return (
                    <li key={centralizedData.id}>
                      <a href={sanitizeUrl} target="_blank" rel="noreferrer">
                        {centralizedData.name}
                      </a>
                      {' - '}
                      {centralizedData.description}
                      {' '}
                      (Discussion added by
                      {' '}
                      <b>{ nameOrId}</b>
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

ProposalItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  usersList: PropTypes.object.isRequired,
  proposer: PropTypes.string.isRequired,
  centralizedDatas: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    proposerAddress: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
  boundedCall: call.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
};

export default ProposalItem;
