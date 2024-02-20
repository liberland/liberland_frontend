import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import { ReactComponent as CopyIcon } from '../../../../assets/icons/copy.svg';

import { democracyActions } from '../../../../redux/actions';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { DelegateModal } from '../../../Modals';
import Button from '../../../Button/Button';
import truncate from '../../../../utils/truncate';
import NotificationPortal from '../../../NotificationPortal';

function PoliticanCard({
  politician,
}) {
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const [isModalOpenDelegate, setIsModalOpenDelegate] = useState(false);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const isBigScreen = useMediaQuery('(min-width: 1250px)');

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
      <div className={styles.nameAndIcons}>
        <div className={styles.politicianImageContainer}>
          <img src={liberlandEmblemImage} style={{ height: '100%' }} alt="liberlandEmblemImage" />
        </div>
        <div className={styles.politicianPartyImageContainer}>
          <img src={libertarianTorch} style={{ height: '100%' }} alt="libertarianTorch" />
        </div>
        <div className={styles.copyName}>
          <div className={styles.copyWithName}>
            <CopyIcon
              className={styles.copyIcon}
              name="walletAddress"
              onClick={() => handleCopyClick(politician.name)}
            />
            <span>{isBigScreen ? politician.name : truncate(politician.name, 13)}</span>
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
