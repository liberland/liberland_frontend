import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Card from "../../../../Card";
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

const LegacyHash = ({hash}) => {
  return hash;
}

const Inline = () => {
  return "Inline call";
}

const Lookup = ({hash}) => {
  return hash;
}

const BoundedCall = ({call}) => {
  if ("Legacy" in call) {
    return <LegacyHash hash={call["Legacy"]["hash_"]} />;
  } else if ("Inline" in call) {
    console.warn("Inline call details:", call);
    return <Inline />;
  } else if ("Lookup" in call) {
    return <Lookup hash={call["Lookup"]["hash_"]} />;
  }
  console.warn("Unknown call details:", call);
  return "Unknown type of call.";
}

const ProposalItem = ({
  name, createdBy, currentEndorsement, externalLink, description, userDidEndorse, boundedCall, buttonEndorseCallback, proposalIndex
 }) => {
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
  )
}
export default ProposalItem;
