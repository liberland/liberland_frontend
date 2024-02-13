import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import {
  blockchainSelectors,
  userSelectors,
  onboardingSelectors,
  walletSelectors,
  identitySelectors,
} from '../../redux/selectors';
import UnsupportedBrowserNoticeComponent from './UnSupportedBrowserNoticeComponent';
import LoadingComponent from './LoadingComponent';
import NoWalletsDetectedInBrowser from './NoWalletsDetectedInBrowser';
import NoConnectedWalletComponent from './NoConnectedWalletComponent';
import MissingWalletComponent from './MissingWalletComponent';
import OnBoarding from './OnBording';
import { onBoardingActions } from '../../redux/actions';
import { parseIdentityData, parseLegal } from '../../utils/identityParser';

const useIsUnsupportedBrowser = () => {
  const [isBrave, setIsBrave] = useState(null);

  useEffect(() => {
    (async () => {
      setIsBrave(!!(navigator.brave && (await navigator.brave.isBrave())));
    })();
  }, [setIsBrave]);

  return isBrave;
};

function GuidedSetupWrapper({ children }) {
  return (
    <div className={styles.guidedSetupWrapper}>
      <div className={styles.componentWrapper}>{children}</div>
    </div>
  );
}

function GuidedSetup({ children }) {
  const dispatch = useDispatch();
  const [acceptedBrowser, setAcceptedBrowser] = useState(
    localStorage.getItem('unsupportedBrowserAcceptedByUser'),
  );
  const isSessionReady = useSelector(userSelectors.selectIsSessionReady);
  const extensions = useSelector(blockchainSelectors.extensionsSelector);
  const liquidDollars = useSelector(
    walletSelectors.selectorLiquidDollarsBalance,
  );
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const userWalletAddress = useSelector(userSelectors.selectWalletAddress);
  const userId = useSelector(userSelectors.selectUserId);
  const isUserEligibleForComplimentaryLLD = useSelector(
    onboardingSelectors.selectorEligibleForComplimentaryLLD,
  );
  const identityData = useSelector(identitySelectors.selectorIdentity);
  const isUnsupportedBrowser = useIsUnsupportedBrowser();
  const isLoadingUser = useSelector(userSelectors.selectIsLoading);

  const isLoading = !isSessionReady
    || isLoadingUser
    || extensions === null
    || wallets === null
    || isUnsupportedBrowser === null;

  const onUnsupportedBrowserAccept = () => {
    localStorage.setItem('unsupportedBrowserAcceptedByUser', true);
    setAcceptedBrowser(true);
  };

  const isIdentityEmpty = useMemo(() => {
    if (!identityData) return null;
    if (identityData?.isSome) {
      const identity = identityData.unwrap();
      const { info } = identity;
      return (
        !parseIdentityData(info?.display)
        && !parseLegal(info)
        && !parseIdentityData(info?.web)
        && !parseIdentityData(info?.email)
      );
    }
    return null;
  }, [identityData]);

  const isSkippedOnBoardingGetLLD = sessionStorage.getItem(
    'SkippedOnBoardingGetLLD',
  );

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

  if (!acceptedBrowser && isUnsupportedBrowser) {
    return (
      <GuidedSetupWrapper>
        <UnsupportedBrowserNoticeComponent
          onAccept={onUnsupportedBrowserAccept}
        />
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

  if (
    (isUserEligibleForComplimentaryLLD
      || isIdentityEmpty
    || isSkippedOnBoardingGetLLD === 'secondStep') && isSkippedOnBoardingGetLLD !== 'true'
  ) {
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
