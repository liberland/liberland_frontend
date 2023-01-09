import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import Button from '../../../../Button/Button';

const endorseButton = (buttonEndorseCallback, userDidEndorse, referendumInfo) => (userDidEndorse ? (
  <Button medium gray>
    Already endorsed
  </Button>
)
  : (
    <Button medium primary onClick={() => { buttonEndorseCallback(referendumInfo); }}>
      Endorse
    </Button>
  ));

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
  name, createdBy, currentEndorsement, externalLink, description, userDidEndorse, boundedCall, buttonEndorseCallback, proposalIndex,
}) {
  return (
    <Card
      title={name}
      className={styles.cardProposalsSection}
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
              <BoundedCall call={boundedCall} />
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
        <div className={styles.buttonContainer}>
          {endorseButton(buttonEndorseCallback, userDidEndorse, { name, proposalIndex })}
        </div>
      </div>
    </Card>
  );
}
export default ProposalItem;
