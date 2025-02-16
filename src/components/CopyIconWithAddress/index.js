import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import notification from 'antd/es/notification';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import CopyInputIcon from '../../assets/icons/copy-input.svg';
import truncate from '../../utils/truncate';
import styles from './styles.module.scss';

function CopyIconWithAddress({
  address, name, isTruncate, legal, showAddress,
}) {
  const [api, contextHolder] = notification.useNotification();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    api.success({ message: 'Address was copied' });
  };

  return (
    <Flex gap="10px" className={styles.copyIconWithAdress}>
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
      <Avatar
        size={20}
        shape="square"
        className={styles.copyIcon}
        src={CopyInputIcon}
        onClick={() => handleCopyClick(address)}
      />
    </Flex>
  );
}

CopyIconWithAddress.defaultProps = {
  name: null,
  address: null,
  isTruncate: true,
  legal: null,
  showAddress: false,
};

CopyIconWithAddress.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  isTruncate: PropTypes.bool,
  legal: PropTypes.string,
  showAddress: PropTypes.bool,
};

export default CopyIconWithAddress;
