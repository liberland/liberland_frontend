import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {blockchainSelectors, errorsSelectors} from "../../redux/selectors";
import {useHistory} from "react-router-dom";
import {setCentralizedBackendBlockchainAddress} from "../../api/backend";
import api from "../../api";
import {authActions} from "../../redux/actions";
import styles from './styles.module.scss';
import truncate from "../../utils/truncate";
import Button from "../Button/Button";
import {useMediaQuery} from "usehooks-ts";

const WalletListComponent = ({walletList, buttonCallback, userId}) => {
  return (
    <div style={{width: '100%'}}>
      {walletList.map((walletObject, index) => {
        return(
          <div className={styles.connectWalletContainer} key={'availableWallet'+index}>
            <div className={styles.connectWalletAddressText}>{truncate(walletObject.address, 25)}</div>
            <div className={styles.connectWalletAddressButtonContainer}>
              <Button primary className={styles.connectWalletAddressButton} onClick={() => buttonCallback(walletObject.address, userId)}>Connect</Button>
            </div>
            <br />
          </div>
        )
      })}
    </div>
  )
}
const NoConnectedWalletComponent = ({walletList, buttonCallback, userId}) => (
  <div>
    <h2>Register wallet</h2>
    <p>You do not yet have a connected wallet address on <a href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</a>.</p>
    <br />
    <p>You can connect one of the detected wallets now</p>
    <br />
    <WalletListComponent walletList={walletList} buttonCallback={buttonCallback} userId={userId} />
  </div>
)
const MissingWalletComponent = ({walletList, registeredAddress, buttonCallback, userId}) => {
  return (
    <div>
      <h2>Missing wallet</h2>
      <p>You already registered a wallet address but it is not available on this device</p>
      <br />
      <p>The address you registered is: </p>
      <br />
      <p className={styles.blockchainAddressContainer}>{registeredAddress}</p>
      <br />
      <p>Please log in with a browser or app that has this address available.</p>
      <p>Alternatively, you can reigster another address on <a href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</a> or contact support.</p>
      <br />
      <p>If you are absolutely sure you want to change your wallet address to one available on this device <a onClick={() =>{document.getElementById("missing-wallet-component-wallet-list").style.display = 'flex';}}><b>click here</b></a>. </p>
      <br />
      <div id='missing-wallet-component-wallet-list' style={{display:"none", width: '100%'}}>
        <WalletListComponent walletList={walletList} buttonCallback={buttonCallback} userId={userId} />
      </div>
    </div>
  )
}
function LoadingComponent () {
  return (
    <div>Loading...</div>
  )
}

const UnsupportedBrowserNoticeComponent = ({setUnsupportedBrowserNoticeDismissed}) => {
  return (
    <div>
      <h2>Unsupported browser</h2>
      <p>You seem to be using an unsupported browser like Brave.</p>
      <br />
      <p>Some browsers require registering the blockchains network from the browsers developers.</p>
      <br />
      <p>This is not possible until our network grows.</p>
      <br />
      <p>Please use another browser like <b>Firefox, Chrome, or Subwallet app</b>.</p>
      <br />
      <p>Alternatively, if you understand that the app might not work correctly in your browser, <i><a onClick={() => {setUnsupportedBrowserNoticeDismissed(true)}}>click here to proceed</a></i>.</p>
    </div>
  )
}

const NoWalletsDetectedInBrowser = ({isMedium}) => {
  return (
    <div>
      <h2>No wallet</h2>
      <p>No wallet was detected.</p>
      {isMedium ? (<div>
          <p>You need to have a wallet extension like polkadotjs or subwallet to proceed</p>
          <br />
          <p>If you have the extension, make sure its enabled and a wallet is available for use on any chain.</p>
      </div>)
        :(<p>You need to visit this site inside a dApp explorer like <a href={'https://www.subwallet.app/download.html'}> <b>Subwallet</b></a></p>)}
      <br />
      <p><a href={'https://liberland-1.gitbook.io/wiki/v/public-documents/blockchain/for-citizens/onboarding'}> Read the guide for details</a></p>
    </div>
    )
}

const checkUnsupportedBrowser = async () => {
  const isBrave = ((navigator.brave && await navigator.brave.isBrave()) || false);
  if (isBrave) {
    return true
  }
  return false
}

function GuidedSetup() {
  const GuidedStepEnum = {
    LOADING: 0,
    UNSUPPORTED_BROWSER: 1,
    NO_WALLETS_AVAILABLE: 2,
    MISSING_WALLET: 3,
    NO_CONNECTED_WALLET: 4
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const apiError = useSelector(errorsSelectors.selectSignIn);
  const allAccounts = useSelector(blockchainSelectors.allWalletsSelector);
  const [componentActive, setComponentActive] = useState(GuidedStepEnum.LOADING);
  const [unsupportedBrowserNoticeDismissed, setUnsupportedBrowserNoticeDismissed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [registeredCentralizedBlockchainAddress, setRegisteredCentralizedBlockchainAddress] = useState(null);
  const isMedium = useMediaQuery('(min-width: 48em)');

  const ssoAccessTokenHash = sessionStorage.getItem('ssoAccessTokenHash')

  const setCentralizedBackendAddress = (blockchainAddress, userId) => {
    setCentralizedBackendBlockchainAddress(blockchainAddress, userId, ssoAccessTokenHash).then(result =>{
      //TODO FIXME due to api error this will return 500 even if everything is OK, so duplicating logic
      onSubmit({ wallet_address: blockchainAddress, rememberMe: false });
    }).catch(e => {
      //TODO FIXME due to api error this will return 500 even if everything is OK, so duplicating logic
      onSubmit({ wallet_address: blockchainAddress, rememberMe: false });
    })

  }

  const onSubmit = (values) => {
    dispatch(authActions.signIn.call({
      credentials: values,
      history,
      ssoAccessTokenHash,
    }));
  };

  useEffect(() => {
    if (ssoAccessTokenHash) {

      Promise.all([checkUnsupportedBrowser(), api.get('/users/me')]).then(([isUnsupportedBrowser, userResult]) =>{
        if(isUnsupportedBrowser && !unsupportedBrowserNoticeDismissed){
          // Warn if using unsupported browser
          setComponentActive(GuidedStepEnum.UNSUPPORTED_BROWSER)
        } else if (allAccounts.length === 0) {
          // Warn if no wallets available
          setComponentActive(GuidedStepEnum.NO_WALLETS_AVAILABLE)
        } else {
          const centralizedWalletAddress = userResult?.data?.blockchainAddress
          setRegisteredCentralizedBlockchainAddress(centralizedWalletAddress)
          const walletAddress = allAccounts.find((account) => account.address === centralizedWalletAddress);
          let backendUserId = userResult.data.id
          setUserId(backendUserId)
          // Everything OK
          if (walletAddress) {
            setComponentActive(GuidedStepEnum.LOADING)
            onSubmit({ wallet_address: walletAddress.address, rememberMe: false });
          } else if (userResult?.data?.blockchainAddress?.length){
            // Warn that wallet address is registered in database but not available in current browser
            setComponentActive(GuidedStepEnum.MISSING_WALLET)
          } else {
            // No wallet is registered but there is one available, offer to register it now
            setComponentActive(GuidedStepEnum.NO_CONNECTED_WALLET)
          }
        }
      })
    }
  }, [apiError, dispatch, ssoAccessTokenHash, allAccounts, unsupportedBrowserNoticeDismissed, componentActive, userId, registeredCentralizedBlockchainAddress]);

  function renderRelevantComponent() {
    if(componentActive === GuidedStepEnum.LOADING) { return <LoadingComponent />}
    if(componentActive === GuidedStepEnum.UNSUPPORTED_BROWSER) { return <UnsupportedBrowserNoticeComponent setUnsupportedBrowserNoticeDismissed={setUnsupportedBrowserNoticeDismissed} />}
    if(componentActive === GuidedStepEnum.NO_WALLETS_AVAILABLE) { return <NoWalletsDetectedInBrowser isMedium={isMedium} />}
    if(componentActive === GuidedStepEnum.NO_CONNECTED_WALLET) { return <NoConnectedWalletComponent walletList={allAccounts} buttonCallback={setCentralizedBackendAddress} userId={userId}/>}
    if(componentActive === GuidedStepEnum.MISSING_WALLET) { return <MissingWalletComponent walletList={allAccounts} registeredAddress={registeredCentralizedBlockchainAddress} buttonCallback={setCentralizedBackendAddress} userId={userId}/>}
    return <LoadingComponent />
  }
  return (
    <div className={styles.guidedSetupWrapper}>
      <div className={styles.componentWrapper}>
        {renderRelevantComponent()}
      </div>
    </div>
  )
}

export default GuidedSetup
