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
import stylesVotes from '../SelectedCandidateCard/styles.module.scss';

function CandidateCard({
  politician, selectCandidate,
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
      <div className={stylesVotes.politicianCardContainer}>
        <div className={stylesVotes.leftColumn}>
          <div className={stylesVotes.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="liberlandEmblemImage" />
            <img src={libertarianTorch} style={{ height: '100%' }} alt="libertarianTorch" />
          </div>
          <div className={`${stylesVotes.politicianDisplayName} ${styles.maxContent}`}>
            <CopyIcon
              className={stylesVotes.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
            <span>{truncate(politician.name, isBigScreen ? 20 : 12)}</span>
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
