import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import NotificationPortal from '../../../NotificationPortal';
import CopyIconWithAddress from '../../../CopyIconWithAddress';

function SelectedCandidateCard({
  politician, unselectCandidate, moveSelectedCandidate,
}) {
  const notificationRef = useRef();
  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.politicianCardContainer}>
        <div className={styles.leftColumn}>
          <button
            className={cx(styles.unselectContainer, styles.unselectContainerRed)}
            onClick={() => unselectCandidate(politician)}
          >
            <span className={styles.cross}>&#x2715;</span>
          </button>
          <div className={styles.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="" />
            <img src={libertarianTorch} style={{ height: '100%' }} alt="" />
          </div>
          <div className={cx(styles.politicianDisplayName)}>
            <CopyIconWithAddress
              address={politician.name}
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
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
    name: PropTypes.string.isRequired,
  }).isRequired,
  unselectCandidate: PropTypes.func.isRequired,
  moveSelectedCandidate: PropTypes.func.isRequired,
};

export default SelectedCandidateCard;
