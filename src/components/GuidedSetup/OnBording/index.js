import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  onboardingSelectors, blockchainSelectors, identitySelectors, userSelectors,
} from '../../../redux/selectors';
import { onBoardingActions, identityActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import router from '../../../router';
import UpdateProfile from '../../Profile/UpdateProfile';

function OnBoarding() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isUserEligibleForComplimentaryLLD = useSelector(onboardingSelectors.selectorEligibleForComplimentaryLLD);
  const [isFirstStepSkipped, setIsFirstStepSkipped] = useState(!isUserEligibleForComplimentaryLLD);
  const userName = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const identity = useSelector(identitySelectors.selectorIdentity);
  const ineligibleForComplimentaryLLDReason = useSelector(
    onboardingSelectors.selectorIneligibleForComplimentaryLLDReason,
  );
  const [isModalOpenOnchainIdentity, setIsModalOpenOnchainIdentity] = useState(false);
  const toggleModalOnchainIdentity = () => {
    setIsModalOpenOnchainIdentity((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(identityActions.getIdentity.call(walletAddress));
  }, [dispatch]);

  if (!isFirstStepSkipped) {
    return (
      <div className={styles.wrapper}>
        <h3>You want to revice free LLD?</h3>
        <div className={styles.buttons}>
          <Button
            medium
            primary
            onClick={() => {
              dispatch(onBoardingActions.claimComplimentaryLld.call());
            }}
          >
            {ineligibleForComplimentaryLLDReason || 'Claim complimentary LLD'}
          </Button>
          <Button medium secondary onClick={() => setIsFirstStepSkipped(true)}>
            Skip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h3>Update your profile now.</h3>
        <div className={styles.buttons}>
          <Button className={styles.textColor} medium primary onClick={toggleModalOnchainIdentity}>
            Update identity
          </Button>
          <Button
            medium
            secondary
            onClick={() => {
              sessionStorage.setItem('SkippedOnBoardingGetLLD', true);
              history.push(router.home);
            }}
          >
            Skip
          </Button>
        </div>
      </div>
      {isModalOpenOnchainIdentity && (
        <UpdateProfile
          blockNumber={blockNumber}
          identity={identity}
          redirectAfterSubmit={() => history.push(router.home)}
          walletAddress={walletAddress}
          toggleModalOnchainIdentity={toggleModalOnchainIdentity}
          lastName={lastName}
          userName={userName}
        />
      )}
    </>

  );
}

export default OnBoarding;
