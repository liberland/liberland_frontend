import React, { useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import NotificationPortal from '../NotificationPortal';
import truncate from '../../utils/truncate';
import styles from './styles.module.scss';

function CopyIconWithAddress({ address, name }) {
  const notificationRef = useRef();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  return (
    <div className={styles.copyIconWithAdress}>
      <NotificationPortal ref={notificationRef} />
      {name ? (
        <span>{name}</span>
      ) : (
        <span>{truncate(address, isBigScreen ? 20 : 12)}</span>
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
};

CopyIconWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default CopyIconWithAddress;
