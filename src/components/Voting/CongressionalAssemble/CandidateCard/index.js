import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import NotificationPortal from '../../../NotificationPortal';
import stylesVotes from '../SelectedCandidateCard/styles.module.scss';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';

function CandidateCard({ politician, selectCandidate }) {
  const notificationRef = useRef();
  const { website } = politician;

  return (
    <>
      <NotificationPortal ref={notificationRef} />
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
        <div className={stylesVotes.buttonWrapper}>
          {website && (
          <a target="blank" href={sanitizeUrlHelper(website)} className={styles.doubleChevron}>
            <button
              className={cx(stylesVotes.unselectContainer, styles.background, styles.doubleChevron)}
            >
              WEBSITE
            </button>
          </a>
          )}
          <button
            className={cx(stylesVotes.unselectContainer, styles.background)}
            onClick={() => selectCandidate(politician)}
          >
            <span className={styles.doubleChevron}>ADD VOTE</span>
          </button>
        </div>
      </div>
    </>
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
