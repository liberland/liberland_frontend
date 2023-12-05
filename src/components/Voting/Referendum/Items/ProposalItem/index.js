import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';

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

function BoundedCall({ call }) {
  if ('Legacy' in call) {
    return <LegacyHash hash={call.Legacy.hash_} />;
  } if ('Inline' in call) {
    // eslint-disable-next-line no-console
    console.warn('Inline call details:', call);
    return <Inline />;
  } if ('Lookup' in call) {
    return <Lookup hash={call.Lookup.hash_} />;
  }
  // eslint-disable-next-line no-console
  console.warn('Unknown call details:', call);
  return 'Unknown type of call.';
}

function ProposalItem({
  name,
  createdBy,
  externalLink,
  description,
  boundedCall,
  blacklistMotion,
}) {
  let hash, len;
  if ('Lookup' in boundedCall) {
    hash = boundedCall.Lookup.hash_;
    len = boundedCall.Lookup.len;
  }
  return (
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
                {blacklistMotion}
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
              {' '}
              {createdBy}
            </div>
            <div className={styles.hashText}>
              <BoundedCall call={boundedCall} />
            </div>
          </div>
        </div>
        <div>
          <a href={externalLink}>Read discussion</a>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
        { hash && len && 
          <div>
            Details:
            <Preimage {...{hash, len}} />
          </div>
        }
      </div>
    </Card>
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
    }).isRequired,
  }),
  PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    Inline: PropTypes.any.isRequired,
  }),
]);

BoundedCall.propTypes = { call: call.isRequired };

ProposalItem.propTypes = {
  name: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  boundedCall: call.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
};

export default ProposalItem;
