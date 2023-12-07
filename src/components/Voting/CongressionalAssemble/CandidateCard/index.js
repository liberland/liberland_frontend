import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import addIcon from '../../../../assets/images/arrow-double-right-green.png';
import truncate from '../../../../utils/truncate';
import NotificationPortal from '../../../NotificationPortal';
import { ReactComponent as CopyIcon } from '../../../../assets/icons/copy.svg';

function CandidateCard({
  politician, selectCandidate,
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
          <div className={styles.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="" />
          </div>
          <div className={styles.politicianPartyImageContainer}>
            <img src={libertarianTorch} style={{ height: '100%' }} alt="" />
          </div>
          <div className={`${styles.politicianDisplayName} ${styles.maxContent}`}>
            {truncate(politician.name, 22)}
            <CopyIcon
              className={styles.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
          </div>
        </div>
        <div className={styles.selectCandidateContainer} onClick={() => selectCandidate(politician)}>
          <div className={styles.selectCandidateItems}>
            <div className={styles.selectCandidateImageContainer}>
              <img src={addIcon} style={{ height: '100%' }} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CandidateCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectCandidate: PropTypes.func.isRequired,
};

export default CandidateCard;
