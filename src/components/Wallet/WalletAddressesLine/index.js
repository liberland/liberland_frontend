import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import cx from 'classnames';
import Button from '../../Button/Button';
import NotificationPortal from '../../NotificationPortal';

import { walletActions } from '../../../redux/actions';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';

import { ChoseStakeModal, SendLLDModal, SendLLMModal } from '../../Modals';

import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import { ReactComponent as WalletActiveIcon } from '../../../assets/icons/active-wallet.svg';
import { ReactComponent as ValidatorIcon } from '../../../assets/icons/validator.svg';
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy.svg';

import styles from './styles.module.scss';
import truncate from '../../../utils/truncate';
import router from '../../../router';
import Tabs from '../../Tabs';
import { dollarsToGrains, meritsToGrains } from '../../../utils/walletHelpers';

function WalletAddressesLine({ walletAddress }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenStake, setIsModalOpenStake] = useState(false);
  const [isModalOpenLLM, setIsModalOpenLLM] = useState(false);
  const [modalShown, setModalShown] = useState(0);
  const [sendAddress, setSendAddress] = useState('');
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const addresses = {
    walletAddress,
    validatorAddress: '0x0A1B23Be38A1dbc2A833D051780698CBbd9911FB',
  };

  const isUserHaveStake = useSelector(walletSelectors.selectorIsUserHaveStake);
  const userWalletAddressSelector = useSelector(blockchainSelectors.userWalletAddressSelector);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(userWalletAddressSelector);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);
  const handleModalLLMOpen = () => setIsModalOpenLLM(!isModalOpenLLM);
  const handleModalOpenStake = () => {
    setIsModalOpenStake(!isModalOpenStake);
    setModalShown(0);
  };
  const isValidAddressPolkadotAddress = (address) => {
    try {
      encodeAddress(
        isHex(address)
          ? hexToU8a(address)
          : decodeAddress(address),
      );
      return true;
    } catch (error) {
      return false;
    }
  };
  const handleSubmitForm = (values) => {
    const isAddressValid = isValidAddressPolkadotAddress(sendAddress);

    const preparedValues = values;
    preparedValues.amount = dollarsToGrains(preparedValues.amount);

    if (isAddressValid) {
      dispatch(walletActions.sendTransfer.call(preparedValues));
      handleModalOpen();
    } else {
      notificationRef.current.addError({ text: 'Invalid address.' });
    }
  };

  const handleSubmitFormLLM = (values) => {
    const isAddressValid = isValidAddressPolkadotAddress(sendAddress);

    if (isAddressValid) {
      dispatch(walletActions.sendTransferLLM.call(values));
      handleModalLLMOpen();
    } else {
      notificationRef.current.addError({ text: 'Invalid address.' });
    }
  };

  const handleSubmitStakePolka = (values) => {
    dispatch(walletActions.stakeToPolka.call({ values, isUserHaveStake, walletAddress }));
    handleModalOpenStake();
  };
  const handleSubmitStakeLiberland = (values) => {
    dispatch(walletActions.stakeToLiberland.call({ values, walletAddress }));
    handleModalOpenStake();
  };

  const navigationList = [
    {
      route: router.wallet.overView,
      title: 'Wallet',
    },
    {
      route: router.wallet.validatorsStaking,
      title: 'Validator staking',
    },
  ];

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.walletAddressLineWrapper}>
        <Tabs navigationList={navigationList} />
        <div className={styles.addressesWrapper}>
          <div className={styles.singleAddressWrapper}>
            <p className={styles.addressTitle}>Wallet address:</p>
            <p className={styles.address}>
              <WalletActiveIcon />
              {addresses.walletAddress ? truncate(addresses.walletAddress, 13) : ''}
              <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={(e) => handleCopyClick(e)} />
            </p>
          </div>
          <div className={styles.singleAddressWrapper}>
            <p className={styles.addressTitle}>Validator address:</p>
            <p className={styles.address}>
              <ValidatorIcon />
              {truncate(addresses.validatorAddress, 13)}
              <CopyIcon className={styles.copyIcon} name="validatorAddress" onClick={(e) => handleCopyClick(e)} />
            </p>
          </div>
        </div>
        <div className={cx(styles.buttonsWrapper)}>
          <Button small secondary onClick={handleModalOpenStake}>
            <GraphIcon />
            Staking
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
        <SendLLDModal
          onSubmit={handleSubmitForm}
          closeModal={handleModalOpen}
          addressFrom={walletAddress}
          setSendAddress={setSendAddress}
          sendAddress={sendAddress}
        />
        )}
        {isModalOpenLLM && (
          <SendLLMModal
            onSubmit={handleSubmitFormLLM}
            closeModal={handleModalLLMOpen}
            addressFrom={walletAddress}
            setSendAddress={setSendAddress}
            sendAddress={sendAddress}
          />
        )}
        {isModalOpenStake && (
        <ChoseStakeModal
          closeModal={handleModalOpenStake}
          handleSubmit={handleSubmit}
          register={register}
          modalShown={modalShown}
          setModalShown={setModalShown}
          handleSubmitStakePolka={handleSubmitStakePolka}
          handleSubmitStakeLiberland={handleSubmitStakeLiberland}
        />
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
