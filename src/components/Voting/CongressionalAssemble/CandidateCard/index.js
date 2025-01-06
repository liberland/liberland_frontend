import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import stylesVotes from '../SelectedCandidateCard/styles.module.scss';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import Button from '../../../Button/Button';

function CandidateCard({ politician, selectCandidate }) {
  const { website } = politician;

  return (
    <div className={stylesVotes.politicianCardContainer}>
      <div className={stylesVotes.leftColumn}>
        <div className={stylesVotes.politicianImageContainer}>
          <img
            src={liberlandEmblemImage}
            style={{ height: '100%' }}
            alt="liberlandEmblemImage"
          />
          <img
            src={libertarianTorch}
            style={{ height: '100%' }}
            alt="libertarianTorch"
          />
        </div>
        <div
          className={`${stylesVotes.politicianDisplayName} ${styles.maxContent}`}
        >
          <CopyIconWithAddress
            isTruncate={!politician.name}
            name={politician.name}
            legal={politician.legal}
            address={politician.rawIdentity}
          />
        </div>
      </div>
      <Flex wrap gap="15px">
        {website && (
          <Button link href={sanitizeUrlHelper(website)}>
            Website
          </Button>
        )}
        <Button
          primary
          onClick={() => selectCandidate(politician)}
        >
          Add vote
        </Button>
      </Flex>
    </div>
  );
}

CandidateCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string,
    legal: PropTypes.string,
    website: PropTypes.string,
    rawIdentity: PropTypes.string.isRequired,
    identityData: PropTypes.shape({
      info: PropTypes.shape({
        web: PropTypes.shape({
          raw: PropTypes.string,
          none: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
  selectCandidate: PropTypes.func.isRequired,
};

export default CandidateCard;
