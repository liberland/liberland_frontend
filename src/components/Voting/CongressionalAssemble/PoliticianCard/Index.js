import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';

import { democracyActions } from '../../../../redux/actions';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { DelegateModal } from '../../../Modals';
import Button from '../../../Button/Button';
import NotificationPortal from '../../../NotificationPortal';
import CopyIconWithAddress from '../../../CopyIconWithAddress';

function PoliticanCard({
  politician,
}) {
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const [isModalOpenDelegate, setIsModalOpenDelegate] = useState(false);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  const handleModalOpenDelegate = () => {
    setIsModalOpenDelegate(!isModalOpenDelegate);
  };
  const handleSubmitDelegate = (delegateAddress) => {
    dispatch(democracyActions.delegate.call({ values: { delegateAddress }, userWalletAddress }));
    handleModalOpenDelegate();
  };

  return (
    <>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.nameAndIcons}>
        <div className={styles.politicianImageContainer}>
          <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="liberlandEmblemImage" />
        </div>
        <div className={styles.politicianPartyImageContainer}>
          <img src={libertarianTorch} style={{ height: '100%' }} alt="libertarianTorch" />
        </div>
        <div className={styles.copyName}>
          <div className={styles.copyWithName}>
            <CopyIconWithAddress
              address={politician.name}
            />
          </div>
          <span className={styles.votesCounterMobile}>1 x Votes</span>
        </div>
      </div>
      { politician.rawIdentity === userWalletAddress ? <div />
        : (
          <div className={styles.buttonWrapper}>
            { delegatingTo === politician.rawIdentity
              ? <Button grey>DELEGATE</Button>
              : <Button primary onClick={handleModalOpenDelegate}>DELEGATE</Button>}
          </div>
        )}
      <span className={styles.votesCounterDesktop}>1 x Votes</span>
      {isModalOpenDelegate && (
      <DelegateModal
        closeModal={handleModalOpenDelegate}
        onSubmitDelegate={handleSubmitDelegate}
        delegateAddress={politician.rawIdentity}
        currentlyDelegatingTo={delegatingTo}
      />
      )}
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
