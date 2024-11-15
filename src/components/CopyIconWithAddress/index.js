import React, { useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import NotificationPortal from '../NotificationPortal';
import truncate from '../../utils/truncate';
import styles from './styles.module.scss';

function CopyIconWithAddress({
  address, name, isTruncate, legal, showAddress, noDetails,
}) {
  const notificationRef = useRef();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  if (noDetails) {
    return (
      <>
        <NotificationPortal ref={notificationRef} />
        <CopyIcon
          className={styles.copyIcon}
          name="walletAddress"
          onClick={() => handleCopyClick(address)}
        />
      </>
    );
  }

  return (
    <div className={styles.copyIconWithAdress}>
      <NotificationPortal ref={notificationRef} />
      {name || legal ? (
        <span>
          {name && truncate(name, 20)}
          {name && legal && ' - '}
          {legal && truncate(legal, 20)}
        </span>
      ) : (
        <span>
          {isTruncate ? truncate(address, isBigScreen ? 18 : 12) : address}
        </span>
      )}
      {showAddress && (name || legal) && (
        <span>
          (
            {isTruncate ? truncate(address, isBigScreen ? 18 : 12) : address}
          )
        </span>
      )}
      <CopyIcon
        className={styles.copyIcon}
        name="walletAddress"
        onClick={() => handleCopyClick(address)}
      />
    </div>
  );
}

CopyIconWithAddress.defaultProps = {
  name: null,
  address: null,
  isTruncate: true,
  legal: null,
  showAddress: false,
  noDetails: false,
};

CopyIconWithAddress.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  isTruncate: PropTypes.bool,
  legal: PropTypes.string,
  showAddress: PropTypes.bool,
  noDetails: PropTypes.bool,
};

export default CopyIconWithAddress;
