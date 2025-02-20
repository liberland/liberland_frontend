import React, { useEffect, useState } from 'react';
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
  ethSelectors,
} from '../../redux/selectors';
import ErrorModal from '../ErrorModal';
import NextBlockCountdown from './NextBlockCountdown';
import { useModal } from '../../context/modalContext';

function LoadingModal() {
  return (
    <Flex justify="center" align="center">
      <NextBlockCountdown />
    </Flex>
  );
}

function Loader({ children }) {
  const { showModal, closeIdModal } = useModal();
  const [modalId, setModalsId] = useState();

  const isEthLoading = useSelector(ethSelectors.selectorEthLoading);
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
    isEthLoading,
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

  useEffect(() => {
    if (isLoading) {
      const id = showModal(<LoadingModal />, { maskClosable: false });
      setModalsId(id);
    }
  }, [isLoading, showModal]);

  useEffect(() => {
    if (!isLoading) {
      closeIdModal(modalId);
    }
  }, [closeIdModal, isLoading, modalId]);

  return (
    <>
      {children}
      <ErrorModal />
    </>
  );
}

Loader.propTypes = {
  children: PropTypes.node,
};

export default Loader;
