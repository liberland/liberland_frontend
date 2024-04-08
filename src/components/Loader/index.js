// LIBS
import React from 'react';
import { ScaleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

// REDUX
import {
  walletSelectors,
  democracySelectors,
  officesSelectors,
  identitySelectors,
  legislationSelectors,
  validatorSelectors,
  congressSelectors,
  registriesSelectors,
  contractsSelectors,
} from '../../redux/selectors';
import ErrorModal from '../ErrorModal';
import BackgroundBlocker from '../BackgroundBlocker';
import NextBlockCountdown from './NextBlockCountdown';

// eslint-disable-next-line react/prop-types
function Loader({ children }) {
  const isGettingWalletInfo = useSelector(walletSelectors.selectorGettingWalletInfo);
  const isGettingDemocracyInfo = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const isLoadingOffices = useSelector(officesSelectors.selectorIsLoading);
  const isLoadingIdentity = useSelector(identitySelectors.selectorIsLoading);
  const isLoadingLegislation = useSelector(legislationSelectors.gettingLegislation);
  const isLoadingValidator = useSelector(validatorSelectors.isLoading);
  const isLoadingCongress = useSelector(congressSelectors.isLoading);
  const isGetRegistries = useSelector(registriesSelectors.isGetRegistries);
  const isLoadingContracts = useSelector(contractsSelectors.selectorIsContractsLoading);

  const isLoading = [
    isLoadingContracts,
    isGettingWalletInfo,
    isGettingDemocracyInfo,
    isLoadingOffices,
    isLoadingIdentity,
    isLoadingLegislation,
    isLoadingValidator,
    isLoadingCongress,
    isGetRegistries,
  ].some((isFetching) => isFetching);

  return (
    <div style={{ position: 'relative', backgroundColor: '#fefefe', minHeight: '100vh' }}>
      { isLoading
        && (
          <BackgroundBlocker>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              <NextBlockCountdown />
            </div>
          </BackgroundBlocker>
        )}
      <ErrorModal>
        { children }
      </ErrorModal>
    </div>
  );
}

export default Loader;
