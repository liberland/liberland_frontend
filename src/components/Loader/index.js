// LIBS
import React from 'react';
import { ScaleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

// REDUX
import {
  userSelectors,
  walletSelectors,
  democracySelectors,
  officesSelectors,
  identitySelectors,
  legislationSelectors,
  bridgeSelectors,
  validatorSelectors,
  congressSelectors,
  registriesSelectors,
} from '../../redux/selectors';
import ErrorModal from '../ErrorModal';
import BackgroundBlocker from '../BackgroundBlocker';

// eslint-disable-next-line react/prop-types
function Loader({ children }) {
  const isSignInFetching = useSelector(userSelectors.selectIsSignInFetching);
  const isGettingWalletInfo = useSelector(walletSelectors.selectorGettingWalletInfo);
  const isGettingDemocracyInfo = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const isLoadingOffices = useSelector(officesSelectors.selectorIsLoading);
  const isLoadingIdentity = useSelector(identitySelectors.selectorIsLoading);
  const isLoadingLegislation = useSelector(legislationSelectors.gettingLegislation);
  const isLoadingBridge = useSelector(bridgeSelectors.isLoading);
  const isLoadingValidator = useSelector(validatorSelectors.isLoading);
  const isLoadingCongress = useSelector(congressSelectors.isLoading);
  const isGetRegistries = useSelector(registriesSelectors.isGetRegistries);

  const isLoading = [
    isSignInFetching,
    isGettingWalletInfo,
    isGettingDemocracyInfo,
    isLoadingOffices,
    isLoadingIdentity,
    isLoadingLegislation,
    isLoadingBridge,
    isLoadingValidator,
    isLoadingCongress,
    isGetRegistries,
  ].some((isFetching) => isFetching);

  return (
    <div style={{ position: 'relative' }}>
      { isLoading
        && (
          <BackgroundBlocker>
            <ScaleLoader
              loading={isLoading}
              css={{
                margin: '0 auto',
                display: 'block',
              }}
              height={60}
              width={6}
              radius={3}
              margin={3}
              color="#8C64B5"
            />
          </BackgroundBlocker>
        )}
      <ErrorModal>
        { children }
      </ErrorModal>
    </div>
  );
}

export default Loader;
