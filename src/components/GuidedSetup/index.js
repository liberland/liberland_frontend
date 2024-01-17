import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { userSelectors } from '../../redux/selectors';
import {
  authActions,
} from '../../redux/actions';
import UnsupportedBrowserNoticeComponent from './UnSupportedBrowserNoticeComponent';
import LoadingComponent from './LoadingComponent';
import NoWalletsDetectedInBrowser from './NoWalletsDetectedInBrowser';
import NoConnectedWalletComponent from './NoConnectedWalletComponent';
import MissingWalletComponent from './MissingWalletComponent';
import { GuidedStepEnum } from '../../utils/enums';

function GuidedSetup() {
  const guidedStep = useSelector(userSelectors.selectGuidedStep);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.guidedStep.call());
  }, [dispatch]);

  return (
    <div className={styles.guidedSetupWrapper}>
      <div className={styles.componentWrapper}>
        {(!guidedStep || guidedStep?.component === GuidedStepEnum.LOADING) && <LoadingComponent />}
        {guidedStep?.component === GuidedStepEnum.UNSUPPORTED_BROWSER
         && (
         <UnsupportedBrowserNoticeComponent />
         )}
        {guidedStep?.component === GuidedStepEnum.NO_WALLETS_AVAILABLE && <NoWalletsDetectedInBrowser />}
        {guidedStep?.component === GuidedStepEnum.NO_CONNECTED_WALLET
         && <NoConnectedWalletComponent walletList={guidedStep?.data?.wallets} userId={guidedStep?.data?.userId} />}
        {guidedStep?.component === GuidedStepEnum.MISSING_WALLET
         && (
         <MissingWalletComponent
           walletList={guidedStep?.data?.wallets}
           registeredAddress={guidedStep?.data?.centralizedWalletAddress}
           userId={guidedStep?.data?.userId}
         />
         )}
      </div>
    </div>
  );
}

export default GuidedSetup;
