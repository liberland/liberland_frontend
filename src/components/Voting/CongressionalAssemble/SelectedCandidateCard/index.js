import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
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
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
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
            <CopyIcon
              className={styles.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
            <span>{truncate(politician.name, isBigScreen ? 20 : 12)}</span>

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
