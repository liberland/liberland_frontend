import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  onboardingSelectors,
  blockchainSelectors,
  identitySelectors,
  userSelectors,
  walletSelectors,
} from '../../../redux/selectors';
import {
  onBoardingActions,
  walletActions,
} from '../../../redux/actions';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import router from '../../../router';
import UpdateProfile from '../../Profile/UpdateProfile';

function OnBoarding({ setIsSkippedOnBoardingGetLLD }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const isSkippedOnBoardingGetLLD = sessionStorage.getItem(
    'SkippedOnBoardingGetLLD',
  );
  const isUserEligibleForComplimentaryLLD = useSelector(
    onboardingSelectors.selectorEligibleForComplimentaryLLD,
  );
  const liquidDollars = useSelector(
    walletSelectors.selectorLiquidDollarsBalance,
  );
  const isSkipOnBoarding = useSelector(onboardingSelectors.selectorIsSkipOnBoarding);
  const [isFirstStepSkipped, setIsFirstStepSkipped] = useState(
    isSkipOnBoarding
    || isSkippedOnBoardingGetLLD === 'secondStep',
  );
  const userName = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const identity = useSelector(identitySelectors.selectorIdentity);
  const ineligibleForComplimentaryLLDReason = useSelector(
    onboardingSelectors.selectorIneligibleForComplimentaryLLDReason,
  );
  const [isModalOpenOnchainIdentity, setIsModalOpenOnchainIdentity] = useState(false);
  const toggleModalOnchainIdentity = () => {
    setIsModalOpenOnchainIdentity((prevState) => !prevState);
  };
  const isLoading = useSelector(onboardingSelectors.selectorIneligibleForComplimentaryLLDIsLoading);

  useEffect(() => {
    setIsFirstStepSkipped(isSkipOnBoarding);
  }, [isSkipOnBoarding]);

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch, liquidDollars]);

  if (!isFirstStepSkipped) {
    return (
      <div className={styles.wrapper}>
        <h3>Claim 2 gratis LLD for e-residency. This is needed to pay gas fees for onboarding</h3>
        <div className={styles.buttons}>
          <Button
            medium
            primary
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return;
              dispatch(onBoardingActions.claimComplimentaryLld.call());
            }}
          >
            {isUserEligibleForComplimentaryLLD
              ? 'Claim complimentary LLD'
              : ineligibleForComplimentaryLLDReason}
          </Button>
          <Button onClick={() => setIsFirstStepSkipped(true)}>
            Skip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h3>Update identity to claim tokens, e-residency and citizenship.</h3>
        <h4>Once you do, it will take about a day for the Ministry of Interior to onboard you.</h4>
        <div className={styles.buttons}>
          <Button
            className={styles.textColor}
            medium
            primary
            onClick={toggleModalOnchainIdentity}
          >
            Update identity
          </Button>
          <Button
            medium
            gray
            onClick={() => {
              setIsSkippedOnBoardingGetLLD('true');
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
          isGuidedUpdate
          blockNumber={blockNumber}
          identity={identity}
          toggleModalOnchainIdentity={toggleModalOnchainIdentity}
          lastName={lastName}
          userName={userName}
        />
      )}
    </>
  );
}

OnBoarding.propTypes = {
  setIsSkippedOnBoardingGetLLD: PropTypes.func.isRequired,
};

export default OnBoarding;
