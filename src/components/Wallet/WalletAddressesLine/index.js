import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../Button/Button';
import NotificationPortal from '../../NotificationPortal';

import { blockchainSelectors } from '../../../redux/selectors';

import { SendLLDModal, SendLLMModal, UnpoolModal } from '../../Modals';

import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import { ReactComponent as WalletActiveIcon } from '../../../assets/icons/active-wallet.svg';
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy.svg';

import styles from './styles.module.scss';
import truncate from '../../../utils/truncate';
import router from '../../../router';
import Tabs from '../../Tabs';
import PolitipoolModal from '../../Modals/PolitipoolModal';

function WalletAddressesLine({ walletAddress }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPolitipool, setIsModalOpenPolitipool] = useState(false);
  const [isModalOpenUnpool, setIsModalOpenUnpool] = useState(false);
  const [isModalOpenLLM, setIsModalOpenLLM] = useState(false);
  const notificationRef = useRef();
  const addresses = {
    walletAddress,
  };

  const userWalletAddressSelector = useSelector(blockchainSelectors.userWalletAddressSelector);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(userWalletAddressSelector);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);
  const handleModalLLMOpen = () => setIsModalOpenLLM(!isModalOpenLLM);
  const handleModalOpenPolitipool = () => setIsModalOpenPolitipool(!isModalOpenPolitipool);
  const handleModalOpenUnpool = () => setIsModalOpenUnpool(!isModalOpenUnpool);

  const navigationList = [
    {
      route: router.wallet.overView,
      title: 'Wallet',
    },
  ];

  if (process.env.REACT_APP_BRIDGE_TAB_ENABLED === 'true') {
    navigationList.push({
      route: router.wallet.ethBridge,
      title: 'Ethereum bridge',
    });
  }

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <Tabs navigationList={navigationList} />
      <div className={styles.walletAddressLineWrapper}>
        <div className={styles.addressesWrapper}>
          <div className={styles.singleAddressWrapper}>
            <p className={styles.addressTitle}>Wallet address:</p>
            <p className={styles.address}>
              <WalletActiveIcon />
              {addresses.walletAddress ? truncate(addresses.walletAddress, 13) : ''}
              <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={(e) => handleCopyClick(e)} />
            </p>
          </div>
        </div>
        <div className={cx(styles.buttonsWrapper)}>
          <Button small secondary onClick={handleModalOpenPolitipool}>
            <GraphIcon />
            Politipool
          </Button>
          <Button small secondary onClick={handleModalOpenUnpool}>
            <GraphIcon />
            Unpool
          </Button>
          <Button small primary onClick={handleModalLLMOpen}>
            <UploadIcon />
            Send LLM
          </Button>
          <Button small primary onClick={handleModalOpen}>
            <UploadIcon />
            Send LLD
          </Button>
        </div>
        {isModalOpen && (
          <SendLLDModal closeModal={handleModalOpen} />)}
        {isModalOpenLLM && (
          <SendLLMModal closeModal={handleModalLLMOpen} />)}
        {isModalOpenPolitipool && (
          <PolitipoolModal closeModal={handleModalOpenPolitipool} />
        )}
        {isModalOpenUnpool && (
          <UnpoolModal closeModal={handleModalOpenUnpool} />
        )}
      </div>
    </>
  );
}

WalletAddressesLine.defaultProps = {
  walletAddress: '',
};

WalletAddressesLine.propTypes = {
  walletAddress: PropTypes.string,
};

export default WalletAddressesLine;
