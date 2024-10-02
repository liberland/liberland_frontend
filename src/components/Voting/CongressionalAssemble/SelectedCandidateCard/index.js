import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import NotificationPortal from '../../../NotificationPortal';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';

function SelectedCandidateCard({
  politician, unselectCandidate, moveSelectedCandidate,
}) {
  const notificationRef = useRef();
  const { website } = politician;

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.politicianCardContainer}>
        <div className={styles.leftColumn}>
          <button
            className={cx(styles.unselectContainer, styles.unselectContainerRed, styles.mobileNone)}
            onClick={() => unselectCandidate(politician)}
          >
            <span className={styles.cross}>REMOVE</span>
          </button>
          <div className={styles.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="" />
            <img src={libertarianTorch} style={{ height: '100%' }} alt="" />
          </div>
          <div className={cx(styles.politicianDisplayName)}>
            <CopyIconWithAddress
              isTruncate={!politician.name}
              name={politician.name}
              legal={politician.legal}
              address={politician.rawIdentity}
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <button
            className={cx(styles.unselectContainer, styles.unselectContainerRed, styles.mobileRemove)}
            onClick={() => unselectCandidate(politician)}
          >
            <span className={styles.cross}>REMOVE</span>
          </button>
          {website && (
          <a
            target="blank"
            href={sanitizeUrlHelper(website)}
            className={cx(styles.buttonFont, styles.unselectContainer)}
          >
            <button
              className={cx(styles.unselectContainer, styles.backgroundPrimary, styles.buttonFont)}
            >
              WEBSITE
            </button>
          </a>
          )}
          <button onClick={() => moveSelectedCandidate(politician, 'up')} className={styles.orderButtonImageContainer}>
            <span className={styles.icon}>&#x2303;</span>
          </button>
          <button
            onClick={() => moveSelectedCandidate(politician, 'down')}
            className={cx(styles.orderButtonImageContainer, styles.orderButtonImageContainerRed)}
          >
            <span className={cx(styles.icon, styles.arrowDown)}>&#x2304;</span>
          </button>
        </div>
      </div>
    </>
  );
}

SelectedCandidateCard.propTypes = {
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
  unselectCandidate: PropTypes.func.isRequired,
  moveSelectedCandidate: PropTypes.func.isRequired,
};

export default SelectedCandidateCard;
