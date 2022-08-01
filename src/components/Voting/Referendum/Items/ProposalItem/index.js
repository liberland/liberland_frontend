import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Card from "../../../../Card";
import Button from '../../../../Button/Button';

const endorseButton = (buttonEndorseCallback, userDidEndorse, referendumInfo) => (userDidEndorse ? (
    <Button medium primary onClick={() => { buttonEndorseCallback(referendumInfo); }}>
      Endorse
    </Button>
  )
  : (
    <Button medium gray>
      Already endorsed
    </Button>
  ));

const ProposalItem = ({
  name, createdBy, currentEndorsement, externalLink, description, userDidEndorse, hash, buttonEndorseCallback
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
              {hash}
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
          {endorseButton(buttonEndorseCallback, userDidEndorse, { name })}
        </div>
      </div>
    </Card>
  )
}
export default ProposalItem;
