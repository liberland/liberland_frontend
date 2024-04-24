import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import NotificationPortal from '../../../NotificationPortal';
import stylesVotes from '../SelectedCandidateCard/styles.module.scss';
import CopyIconWithAddress from '../../../CopyIconWithAddress';

function CandidateCard({
  politician, selectCandidate,
}) {
  const notificationRef = useRef();
  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={stylesVotes.politicianCardContainer}>
        <div className={stylesVotes.leftColumn}>
          <div className={stylesVotes.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="liberlandEmblemImage" />
            <img src={libertarianTorch} style={{ height: '100%' }} alt="libertarianTorch" />
          </div>
          <div className={`${stylesVotes.politicianDisplayName} ${styles.maxContent}`}>
            <CopyIconWithAddress
              address={politician.name}
            />
          </div>
        </div>
        <button
          className={cx(
            stylesVotes.unselectContainer,
            styles.background,
          )}
          onClick={() => selectCandidate(politician)}
        >
          <span className={styles.doubleChevron}>&#xbb;</span>
        </button>
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
