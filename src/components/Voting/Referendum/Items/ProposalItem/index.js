import React from 'react';
import PropTypes from 'prop-types';
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

function ProposalItem({
  name, createdBy, currentEndorsement, externalLink, description,
  userDidEndorse, hash, buttonEndorseCallback, proposalIndex,
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
          {endorseButton(buttonEndorseCallback, userDidEndorse, { name, proposalIndex })}
        </div>
      </div>
    </Card>
  );
}
ProposalItem.propTypes = {
  name: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  currentEndorsement: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  userDidEndorse: PropTypes.bool.isRequired,
  hash: PropTypes.string.isRequired,
  buttonEndorseCallback: PropTypes.func.isRequired,
  proposalIndex: PropTypes.number.isRequired,
};
export default ProposalItem;
