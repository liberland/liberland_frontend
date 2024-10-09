import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  blockchainSelectors,
  userSelectors,
  onboardingSelectors,
  walletSelectors,
  identitySelectors,
} from '../../redux/selectors';
import LoadingComponent from './LoadingComponent';
import MissingWalletComponent from './MissingWalletComponent';
import OnBoarding from './OnBording';
import { identityActions, onBoardingActions } from '../../redux/actions';
import InstructionOnBoard from './OnBording/InstructionOnBoard';
import { parseIdentityData, parseLegal } from '../../utils/identityParser';
import { GuidedSetupWrapper } from './Wrapper';
import NoConnectedWalletComponent from './NoConnectedWalletComponent';

function GuidedSetup({ children }) {
  const dispatch = useDispatch();
  const [notResidentAcceptedByUser, setNotResidentAcceptedByUser] = useState(sessionStorage.getItem(
    'notResidentAcceptedByUser',
  ));
  const [isSkippedOnBoardingGetLLD, setIsSkippedOnBoardingGetLLD] = useState(sessionStorage.getItem(
    'SkippedOnBoardingGetLLD',
  ));
  const isSessionReady = useSelector(userSelectors.selectIsSessionReady);
  const extensions = useSelector(blockchainSelectors.extensionsSelector);
  const liquidDollars = useSelector(
    walletSelectors.selectorLiquidDollarsBalance,
  );
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const userWalletAddress = useSelector(userSelectors.selectWalletAddress);

  const isUserEligibleForComplimentaryLLD = useSelector(
    onboardingSelectors.selectorEligibleForComplimentaryLLD,
  );

  const isLoadingUser = useSelector(userSelectors.selectIsLoading);
  const isResident = useSelector(onboardingSelectors.selectorIsResident);

  const isLoading = !isSessionReady || isLoadingUser || extensions === null || wallets === null;

  const userHasIdentity = localStorage.getItem('userHasIdentity');
  const [isIdentityEmpty, setIsIdentityEmpty] = useState(true);
  const identityData = useSelector(identitySelectors.selectorIdentity);
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  useEffect(() => {
    if (identityData?.isSome) {
      const identity = identityData.unwrap();
      const { info } = identity;
      const identityIsEmpty = !parseIdentityData(info?.display)
        && !parseLegal(info)
        && !parseIdentityData(info?.web)
        && !parseIdentityData(info?.email);
      setIsIdentityEmpty(identityIsEmpty);
      if (!identityIsEmpty) {
        localStorage.setItem('userHasIdentity', true);
      }
    }
  }, [identityData]);

  useEffect(() => {
    dispatch(identityActions.getIdentity.call(walletAddress));
  }, [dispatch, walletAddress]);

  useEffect(() => {
    dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  }, [dispatch, liquidDollars]);

  if (isLoading) {
    return (
      <GuidedSetupWrapper>
        <LoadingComponent />
      </GuidedSetupWrapper>
    );
  }

  if (!notResidentAcceptedByUser && !isResident && userHasIdentity !== 'true') {
    return (
      <GuidedSetupWrapper>
        <InstructionOnBoard setIsClicked={setNotResidentAcceptedByUser} />
      </GuidedSetupWrapper>
    );
  }
  if (
    (isUserEligibleForComplimentaryLLD
      || isIdentityEmpty
      || isSkippedOnBoardingGetLLD === 'secondStep')
    && isSkippedOnBoardingGetLLD !== 'true'
    && userHasIdentity !== 'true'
  ) {
    return (
      <GuidedSetupWrapper>
        <OnBoarding setIsSkippedOnBoardingGetLLD={setIsSkippedOnBoardingGetLLD} />
      </GuidedSetupWrapper>
    );
  }

  if (!userWalletAddress && !walletAddress) {
    return (
      <GuidedSetupWrapper>
        <NoConnectedWalletComponent />
      </GuidedSetupWrapper>
    );
  }

  if (!wallets.map((w) => w.address).includes(userWalletAddress)) {
    return (
      <GuidedSetupWrapper>
        <MissingWalletComponent />
      </GuidedSetupWrapper>
    );
  }

  return children;
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

GuidedSetup.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuidedSetup;
