import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import UnsupportedBrowserNoticeComponent from '../GuidedSetup/UnSupportedBrowserNoticeComponent';
import NoWalletsDetectedInBrowser from '../GuidedSetup/NoWalletsDetectedInBrowser';
import LoadingComponent from '../GuidedSetup/LoadingComponent';
import { GuidedSetupWrapper } from '../GuidedSetup/Wrapper';
import { blockchainActions } from '../../redux/actions';

const useIsUnsupportedBrowser = () => {
  const [isBrave, setIsBrave] = useState(null);

  useEffect(() => {
    (async () => {
      setIsBrave(!!(navigator.brave && (await navigator.brave.isBrave())));
    })();
  }, [setIsBrave]);

  return isBrave;
};

export function CheckExtensionWalletProvider({ children }) {
  const dispatch = useDispatch();
  const isSessionReady = useSelector(userSelectors.selectIsSessionReady);
  const extensions = useSelector(blockchainSelectors.extensionsSelector);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const [acceptedBrowser, setAcceptedBrowser] = useState(
    localStorage.getItem('unsupportedBrowserAcceptedByUser'),
  );
  const isUnsupportedBrowser = useIsUnsupportedBrowser();
  const onUnsupportedBrowserAccept = () => {
    localStorage.setItem('unsupportedBrowserAcceptedByUser', true);
    setAcceptedBrowser(true);
  };

  const isLoading = !isSessionReady
    || extensions === null
    || wallets === null
    || isUnsupportedBrowser === null;

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

  if (extensions.length === 0 || wallets.length === 0) {
    return (
      <GuidedSetupWrapper>
        <NoWalletsDetectedInBrowser />
      </GuidedSetupWrapper>
    );
  }

  if (!walletAddress) {
    dispatch(blockchainActions.setUserWallet.success(wallets[0].address));
  }

  return children;
}

CheckExtensionWalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};