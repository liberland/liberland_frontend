import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import lawIcon from '../../../../assets/images/lawicon.png';
import { ReactComponent as CopyIcon } from '../../../../assets/icons/copy.svg';

import { democracyActions } from '../../../../redux/actions';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { DelegateModal } from '../../../Modals';
import Button from '../../../Button/Button';
import truncate from '../../../../utils/truncate';
import NotificationPortal from '../../../NotificationPortal';
import {useMediaQuery} from "usehooks-ts";

function PoliticanCard({
  politician,
}) {
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const [isModalOpenDelegate, setIsModalOpenDelegate] = useState(false);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const isMedium = useMediaQuery('(min-width: 48em)');

  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  const handleModalOpenDelegate = () => {
    setIsModalOpenDelegate(!isModalOpenDelegate);
  };
  const handleSubmitDelegate = (delegateAddress) => {
    dispatch(democracyActions.delegate.call({ values: { delegateAddress }, userWalletAddress }));
    handleModalOpenDelegate();
  };

  const handleCopyClick = (dataToCoppy) => {
    navigator.clipboard.writeText(dataToCoppy);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.politicianCardContainer}>
        <div className={styles.politicianData}>
          <div className={styles.politicianImageContainer}>
            <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="" />
          </div>
          <div className={styles.politicianPartyImageContainer}>
            <img src={libertarianTorch} style={{ height: '100%' }} alt="" />
          </div>
          <div className={`${styles.politicianDisplayName} ${styles.maxContent}`}>
            {isMedium ? politician.name : truncate(politician.name, 20)}
            <CopyIcon
              className={styles.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
          </div>
        </div>
        <div className={styles.politicianVotingPower}>
          <div className={styles.politicianVotingPowerItems}>
            { politician.rawIdentity === userWalletAddress ? null
              : (
                <div className={styles.buttonWrapper}>
                  { delegatingTo === politician.rawIdentity
                    ? <Button small grey>Delegated</Button>
                    : <Button small primary onClick={handleModalOpenDelegate}>Delegate</Button>}
                </div>
              )}
            <div className={styles.maxContent}>
              <div>
                <span className={styles.politicianVotingPowerNumber}>1</span>
                {' '}
                x
                {' '}
              </div>
              <div className={styles.politicianVotingPowerImageContainer}>
                <img src={lawIcon} style={{ height: '100%' }} alt="" />
              </div>
            </div>
          </div>
        </div>
        {isModalOpenDelegate && (
          <DelegateModal
            closeModal={handleModalOpenDelegate}
            onSubmitDelegate={handleSubmitDelegate}
            delegateAddress={politician.rawIdentity}
            currentlyDelegatingTo={delegatingTo}
          />
        )}
      </div>
    </>
  );
}

PoliticanCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rawIdentity: PropTypes.string.isRequired,
  }).isRequired,
};

export default PoliticanCard;
