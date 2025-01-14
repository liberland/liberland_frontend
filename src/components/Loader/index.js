import React from 'react';
import { useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import {
  walletSelectors,
  democracySelectors,
  officesSelectors,
  identitySelectors,
  legislationSelectors,
  validatorSelectors,
  congressSelectors,
  registriesSelectors,
  dexSelectors,
  contractsSelectors,
  senateSelectors,
  nftsSelectors,
  ministryFinanceSelector,
} from '../../redux/selectors';
import ErrorModal from '../ErrorModal';
import NextBlockCountdown from './NextBlockCountdown';
import ModalRoot from '../Modals/ModalRoot';

function Loader({ children }) {
  const isGettingWalletInfo = useSelector(walletSelectors.selectorGettingWalletInfo);
  const isGettingDemocracyInfo = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const isLoadingOffices = useSelector(officesSelectors.selectorIsLoading);
  const isLoadingIdentity = useSelector(identitySelectors.selectorIsLoading);
  const isLoadingLegislation = useSelector(legislationSelectors.gettingLegislation);
  const isLoadingValidator = useSelector(validatorSelectors.isLoading);
  const isLoadingCongress = useSelector(congressSelectors.isLoading);
  const isGetRegistries = useSelector(registriesSelectors.isGetRegistries);
  const isLoadingDex = useSelector(dexSelectors.selectorIsLoading);
  const isLoadingContracts = useSelector(contractsSelectors.selectorIsContractsLoading);
  const isLoadingSenate = useSelector(senateSelectors.isLoading);
  const isLoadingNfts = useSelector(nftsSelectors.isLoading);
  const isLoadingMinistryFinance = useSelector(ministryFinanceSelector.isLoading);

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
    isLoadingDex,
    isLoadingSenate,
    isLoadingNfts,
    isLoadingMinistryFinance,
  ].some((isFetching) => isFetching);

  return (
    <>
      {isLoading && (
        <ModalRoot>
          <Flex justify="center" align="center">
            <NextBlockCountdown />
          </Flex>
        </ModalRoot>
      )}
      <ErrorModal>
        {children}
      </ErrorModal>
    </>
  );
}

Loader.propTypes = {
  children: PropTypes.node,
};

export default Loader;
