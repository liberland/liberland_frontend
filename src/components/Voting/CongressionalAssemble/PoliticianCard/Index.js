import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { hexToString } from '@polkadot/util';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import stylesVotes from '../styles.module.scss';

import { democracyActions } from '../../../../redux/actions';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { DelegateModal } from '../../../Modals';
import Button from '../../../Button/Button';
import NotificationPortal from '../../../NotificationPortal';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';

function PoliticanCard({
  politician,
}) {
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const [isModalOpenDelegate, setIsModalOpenDelegate] = useState(false);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const website = politician.identityData.info.web?.raw;
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
              isTruncate={false}
              address={politician.name}
            />
          </div>
          <span className={styles.votesCounterMobile}>1 x Votes</span>
        </div>
      </div>
      <div className={styles.buttonsWrapper}>
        {website && (
        <div className={styles.buttonWrapper}>
          <Button
            className={cx(stylesVotes.unselectContainer, styles.background)}
            primary
          >
            <a target="blank" href={sanitizeUrlHelper(hexToString(website))} className={styles.text}>
              WEBSITE
            </a>
          </Button>
        </div>
        )}
        { politician.rawIdentity === userWalletAddress ? <div />
          : (
            <div className={cx(styles.buttonWrapper, website && styles.marginLeft)}>
              { delegatingTo === politician.rawIdentity
                ? <Button grey>DELEGATE</Button>
                : <Button primary onClick={handleModalOpenDelegate}>DELEGATE</Button>}
            </div>
          )}
      </div>
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
    identityData: PropTypes.shape({
      info: PropTypes.shape({
        web: PropTypes.shape({
          raw: PropTypes.string,
          none: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
};

export default PoliticanCard;
