import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
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
  const isLoading = useSelector(onboardingSelectors.selectorIneligibleForComplimentaryLLDIsLoading);

  useEffect(() => {
    setIsFirstStepSkipped(isSkipOnBoarding);
  }, [isSkipOnBoarding]);

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch, liquidDollars]);

  if (!isFirstStepSkipped) {
    return (
      <Flex vertical>
        <Title level={2}>
          Claim free LLD
        </Title>
        <Paragraph>Claim 2 gratis LLD for e-residency.</Paragraph>
        <Paragraph>
          This is needed to pay gas fees for onboarding
        </Paragraph>
        <Flex wrap gap="15px">
          <Button
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
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex vertical>
      <Title level={2}>Update identity</Title>
      <Paragraph>
        Update identity to claim tokens, e-residency and citizenship.
      </Paragraph>
      <Paragraph>
        Once you do, it will take about a day for the Ministry of Interior to onboard you.
      </Paragraph>
      <Flex wrap gap="15px">
        <UpdateProfile
          isGuidedUpdate
          blockNumber={blockNumber}
          identity={identity}
          lastName={lastName}
          userName={userName}
        />
        <Button
          onClick={() => {
            setIsSkippedOnBoardingGetLLD('true');
            sessionStorage.setItem('SkippedOnBoardingGetLLD', true);
            history.push(router.home);
          }}
        >
          Skip
        </Button>
      </Flex>
    </Flex>
  );
}

OnBoarding.propTypes = {
  setIsSkippedOnBoardingGetLLD: PropTypes.func.isRequired,
};

export default OnBoarding;
