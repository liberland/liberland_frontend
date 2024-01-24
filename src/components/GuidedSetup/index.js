import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import UnsupportedBrowserNoticeComponent from './UnSupportedBrowserNoticeComponent';
import LoadingComponent from './LoadingComponent';
import NoWalletsDetectedInBrowser from './NoWalletsDetectedInBrowser';
import NoConnectedWalletComponent from './NoConnectedWalletComponent';
import MissingWalletComponent from './MissingWalletComponent';

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
  const [acceptedBrowser, setAcceptedBrowser] = useState(localStorage.getItem('unsupportedBrowserAcceptedByUser'));
  const isSessionReady = useSelector(userSelectors.selectIsSessionReady);
  const extensions = useSelector(blockchainSelectors.extensionsSelector);
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const userWalletAddress = useSelector(userSelectors.selectWalletAddress);
  const userId = useSelector(userSelectors.selectUserId);
  const isUnsupportedBrowser = useIsUnsupportedBrowser();

  const isLoading = !isSessionReady
    || extensions === null
    || wallets === null
    || isUnsupportedBrowser === null;

  const onUnsupportedBrowserAccept = () => {
    localStorage.setItem('unsupportedBrowserAcceptedByUser', true);
    setAcceptedBrowser(true);
  };

  if (isLoading) return <LoadingComponent />;

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
