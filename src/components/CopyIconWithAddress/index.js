import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import notification from 'antd/es/notification';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import truncate from '../../utils/truncate';
import styles from './styles.module.scss';

function CopyIconWithAddress({
  address, name, isTruncate, legal, showAddress, noDetails,
}) {
  const [api, contextHolder] = notification.useNotification();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    api.success({ message: 'Address was copied' });
  };

  if (noDetails) {
    return (
      <>
        {contextHolder}
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
      {contextHolder}
      {name || legal ? (
        <span>
          {name && truncate(name, 20)}
          {name && legal && ' - '}
          {legal && truncate(legal, 20)}
        </span>
      ) : (
        <span>
          {isTruncate ? truncate(address || '', isBigScreen ? 18 : 12) : address}
        </span>
      )}
      {showAddress && (name || legal) && (
        <span>
          (
            {isTruncate ? truncate(address || '', isBigScreen ? 18 : 12) : address}
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
