import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../Button/Button';

import { walletActions } from '../../../redux/actions';

import { SendLlmModal } from '../../Modals';

import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import { ReactComponent as WalletActiveIcon } from '../../../assets/icons/active-wallet.svg';
import { ReactComponent as ValidatorIcon } from '../../../assets/icons/validator.svg';
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy.svg';

import styles from './styles.module.scss';
import truncate from '../../../utils/truncate';

const WalletAddressesLine = ({ walletAddress }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const addresses = {
    walletAddress,
    validatorAddress: '0x0A1B23Be38A1dbc2A833D051780698CBbd9911FB',
  };

  const handleCopyClick = (event) => {
    navigator.clipboard.writeText(addresses[event.currentTarget.getAttribute('name')]);
  };

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);
  const handleSubmit = (values) => {
    dispatch(walletActions.sendTransfer.call(values));
    handleModalOpen();
  };

  return (
    <div className={styles.walletAddressLineWrapper}>
      <div className={styles.addressesWrapper}>
        <div className={styles.singleAddressWrapper}>
          <p className={styles.addressTitle}>Wallet address:</p>
          <p className={styles.address}>
            <WalletActiveIcon />
            {addresses.walletAddress ? truncate(addresses.walletAddress, 13) : ''}
            <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={handleCopyClick} />
          </p>
        </div>
        <div className={styles.singleAddressWrapper}>
          <p className={styles.addressTitle}>Validator address:</p>
          <p className={styles.address}>
            <ValidatorIcon />
            {truncate(addresses.validatorAddress, 13)}
            <CopyIcon className={styles.copyIcon} name="validatorAddress" onClick={handleCopyClick} />
          </p>
        </div>
      </div>
      <div className={cx(styles.buttonsWrapper)}>
        <Button small secondary>
          <GraphIcon />
          Stake LLM
        </Button>
        <Button small primary onClick={handleModalOpen}>
          <UploadIcon />
          Send LLM
        </Button>
      </div>
      {isModalOpen && (
      <SendLlmModal
        onSubmit={handleSubmit}
        closeModal={handleModalOpen}
        addressFrom={walletAddress}
      />
      )}
    </div>
  );
};

WalletAddressesLine.defaultProps = {
  walletAddress: '',
};

WalletAddressesLine.propTypes = {
  walletAddress: PropTypes.string,
};

export default WalletAddressesLine;
