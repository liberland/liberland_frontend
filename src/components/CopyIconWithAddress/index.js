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
  address,
  name,
  isTruncate,
  legal,
  showAddress,
  truncateBy,
  hideAddress,
}) {
  const [api, contextHolder] = notification.useNotification();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    api.success({ message: 'Address was copied' });
  };

  const truncateValues = {
    bigScreen: 18,
    smallScreen: 12,
    ...truncateBy,
  };

  const truncateByScreen = isBigScreen ? truncateValues.bigScreen : truncateValues.smallScreen;
  const shouldTruncate = isTruncate ?? true;

  return (
    <Flex gap="10px" className={styles.copyIconWithAdress}>
      {contextHolder}
      {name || legal ? (
        <span>
          {name && truncate(name, 20)}
          {name && legal && ' - '}
          {legal && truncate(legal, 20)}
        </span>
      ) : !hideAddress && (
        <span>
          {shouldTruncate ? truncate(address || '', truncateByScreen) : address}
        </span>
      )}
      {showAddress && !hideAddress && (name || legal) && (
        <span>
          (
            {shouldTruncate ? truncate(address || '', truncateByScreen) : address}
          )
        </span>
      )}
      <Avatar
        size={20}
        shape="square"
        className={styles.copyIcon}
        src={CopyInputIcon}
        onClick={(e) => {
          e.stopPropagation();
          handleCopyClick(address);
        }}
      />
    </Flex>
  );
}

CopyIconWithAddress.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  isTruncate: PropTypes.bool,
  legal: PropTypes.string,
  showAddress: PropTypes.bool,
  hideAddress: PropTypes.bool, // TODO: These props are very poorly named and this component should be refactored
  truncateBy: PropTypes.shape({ bigScreen: PropTypes.number.isRequired, smallScreen: PropTypes.number.isRequired }),
};

export default CopyIconWithAddress;
