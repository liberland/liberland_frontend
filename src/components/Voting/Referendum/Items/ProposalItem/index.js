import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import styles from './styles.module.scss';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import NotificationPortal from '../../../../NotificationPortal';
import Header from '../Header';
import Discussions from '../Discussions';
import stylesItem from '../item.module.scss';

// REDUX
import { congressActions } from '../../../../../redux/actions';
import {
  congressSelectors,
} from '../../../../../redux/selectors';
import Details from '../Details';

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
  centralizedDatas,
  boundedCall,
  blacklistMotion,
  userIsMember,
}) {
  let hash;
  let len;
  if ('lookup' in boundedCall) {
    hash = boundedCall.lookup.hash;
    len = boundedCall.lookup.len;
  } else if ('legacy' in boundedCall) {
    hash = boundedCall.legacy.hash;
  } else {
    // this sux but we have no other way until we refactor it to NOT use toJSON/toHuman
    hash = blake2AsHex(hexToU8a(boundedCall.inline));
  }

  const [isProposalHidden, setIsProposalHidden] = useState(true);
  const notificationRef = useRef();
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };
  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={stylesItem.itemWrapper}>
        <Header
          handleCopyClick={handleCopyClick}
          hash={hash}
          setIsHidden={setIsProposalHidden}
          isHidden={isProposalHidden}
          textButton="PROPOSAL"
        >
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
                <BlacklistButton hash={
                boundedCall?.lookup?.hash
                ?? boundedCall?.legacy?.hash
              }
                />
              </div>
            )}
        </Header>
        {!isProposalHidden && hash && len
            && (
            <Details proposal={{ hash, len }} isProposal />
            )}
        {!isProposalHidden && centralizedDatas?.length > 0
          && <Discussions centralizedDatas={centralizedDatas} handleCopyClick={handleCopyClick} />}
      </div>
    </>
  );
}

const call = PropTypes.oneOfType([
  PropTypes.shape({
    legacy: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    lookup: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      len: PropTypes.number.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    inline: PropTypes.any.isRequired,
  }),
]);

ProposalItem.propTypes = {
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
  userIsMember: PropTypes.string.isRequired,
};

export default ProposalItem;
