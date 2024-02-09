import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import { blockchainSelectors, userSelectors, onboardingSelectors } from '../../redux/selectors';
import UnsupportedBrowserNoticeComponent from './UnSupportedBrowserNoticeComponent';
import LoadingComponent from './LoadingComponent';
import NoWalletsDetectedInBrowser from './NoWalletsDetectedInBrowser';
import NoConnectedWalletComponent from './NoConnectedWalletComponent';
import MissingWalletComponent from './MissingWalletComponent';
import OnBoarding from './OnBording';
import { onBoardingActions } from '../../redux/actions';
import InstructionOnBoard from './OnBording/InstructionOnBoard';

const useIsUnsupportedBrowser = () => {
  const [isBrave, setIsBrave] = useState(null);

  useEffect(() => {
    (async () => {
      setIsBrave(!!(navigator.brave && await navigator.brave.isBrave()));
    })();
  }, [setIsBrave]);

  return isBrave;
};

function GuidedSetupWrapper({ children }) {
  return (
    <div className={styles.guidedSetupWrapper}>
      <div className={styles.componentWrapper}>
        {children}
      </div>
    </div>
  );
}

function GuidedSetup({ children }) {
  const dispatch = useDispatch();
  const [acceptedBrowser, setAcceptedBrowser] = useState(localStorage.getItem('unsupportedBrowserAcceptedByUser'));
  const isSessionReady = useSelector(userSelectors.selectIsSessionReady);
  const extensions = useSelector(blockchainSelectors.extensionsSelector);
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const userWalletAddress = useSelector(userSelectors.selectWalletAddress);
  const userId = useSelector(userSelectors.selectUserId);
  const isUserEligibleForComplimentaryLLD = useSelector(onboardingSelectors.selectorEligibleForComplimentaryLLD);
  const isUnsupportedBrowser = useIsUnsupportedBrowser();
  const roles = useSelector(userSelectors.selectUserRole);

  const isLoading = !isSessionReady
    || extensions === null
    || wallets === null
    || isUnsupportedBrowser === null;

  const onUnsupportedBrowserAccept = () => {
    localStorage.setItem('unsupportedBrowserAcceptedByUser', true);
    setAcceptedBrowser(true);
  };

  const isSkippedOnBoardingGetLLD = sessionStorage.getItem('SkippedOnBoardingGetLLD');
  const notResidentAcceptedByUser = sessionStorage.getItem('notResidentAcceptedByUser');

  useEffect(() => {
    dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  }, [dispatch]);

  if (isLoading) {
    return (
      <GuidedSetupWrapper>
        <LoadingComponent />
      </GuidedSetupWrapper>
    );
  }

  if (!acceptedBrowser && isUnsupportedBrowser) {
    return (
      <GuidedSetupWrapper>
        <UnsupportedBrowserNoticeComponent onAccept={onUnsupportedBrowserAccept} />
      </GuidedSetupWrapper>
    );
  }

  if (!userId) return children;

  if (extensions.length === 0 || wallets.length === 0) {
    return (
      <GuidedSetupWrapper>
        <NoWalletsDetectedInBrowser />
      </GuidedSetupWrapper>
    );
  }

  if (!userWalletAddress) {
    return (
      <GuidedSetupWrapper>
        <NoConnectedWalletComponent />
      </GuidedSetupWrapper>
    );
  }

  if (true && !notResidentAcceptedByUser && (roles['e-resident'] !== 'e-resident')) {
    return (
      <GuidedSetupWrapper>
        <InstructionOnBoard />
      </GuidedSetupWrapper>
    );
  }

  if ((isUserEligibleForComplimentaryLLD && isSkippedOnBoardingGetLLD !== 'true')
  || isSkippedOnBoardingGetLLD === 'secondStep') {
    return (
      <GuidedSetupWrapper>
        <OnBoarding />
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
