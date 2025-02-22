import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import UnsupportedBrowserNoticeComponent from '../GuidedSetup/UnSupportedBrowserNoticeComponent';
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
  const userBlockchainAdressStorage = localStorage.getItem('BlockchainAdress');
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const [acceptedBrowser, setAcceptedBrowser] = useState(
    sessionStorage.getItem('unsupportedBrowserAcceptedByUser'),
  );
  const isUnsupportedBrowser = useIsUnsupportedBrowser();
  const onUnsupportedBrowserAccept = () => {
    sessionStorage.setItem('unsupportedBrowserAcceptedByUser', true);
    setAcceptedBrowser(true);
  };

  const isLoading = !isSessionReady
    || extensions === null
    || wallets === null
    || isUnsupportedBrowser === null;

  useEffect(() => {
    if (!walletAddress && (userBlockchainAdressStorage || (wallets?.length > 0 && wallets[0]?.address))) {
      dispatch(
        blockchainActions.setUserWallet.success(
          userBlockchainAdressStorage || wallets[0].address,
        ),
      );
    }
  }, [walletAddress, userBlockchainAdressStorage, wallets, dispatch]);

  if (isLoading) {
    return (
      <GuidedSetupWrapper isLoading>
        <LoadingComponent />
      </GuidedSetupWrapper>
    );
  }

  if (!acceptedBrowser && isUnsupportedBrowser && walletAddress) {
    return (
      <GuidedSetupWrapper>
        <UnsupportedBrowserNoticeComponent
          onAccept={onUnsupportedBrowserAccept}
        />
      </GuidedSetupWrapper>
    );
  }

  return children;
}

CheckExtensionWalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
