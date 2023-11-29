import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import removeIcon from '../../../../assets/icons/cancel.svg';
import upArrow from '../../../../assets/images/triangle-up-green-weird.png';
import downArrow from '../../../../assets/images/triangle-down-red-weird.png';
import truncate from '../../../../utils/truncate';
import NotificationPortal from '../../../NotificationPortal';
import { ReactComponent as CopyIcon } from '../../../../assets/icons/copy.svg';

function SelectedCandidateCard({
  politician, unselectCandidate, moveSelectedCandidate,
}) {
  const notificationRef = useRef();
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.politicianCardContainer}>
        <div className={styles.politicianData}>
          <div
            className={styles.unselectContainer}
            onClick={() => unselectCandidate(politician)}
          >
            <img src={removeIcon} style={{ height: '2rem' }} alt="" />
          </div>
          <div className={styles.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '2rem' }} alt="" />
          </div>
          <div className={styles.politicianPartyImageContainer}>
            <img src={libertarianTorch} style={{ height: '1.75rem' }} alt="" />
          </div>
          <div className={`${styles.politicianDisplayName} ${styles.maxContent}`}>
            {truncate(politician.name, 13)}
            <CopyIcon
              className={styles.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
          </div>
        </div>
        <div className={styles.orderButtonsContainer}>
          <div className={styles.orderButtons}>
            <div className={styles.orderButtonImageContainer}>
              <div onClick={() => moveSelectedCandidate(politician, 'up')}>
                <img src={upArrow} style={{ height: '1.25rem' }} alt="" />
              </div>
              <div onClick={() => moveSelectedCandidate(politician, 'down')}>
                <img src={downArrow} style={{ height: '1.25rem' }} alt="" />
              </div>
            </div>
          </div>
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
