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
import Blocking from './Blocking';
import Unobtrusive from './Unobtrusive';

function LoadingModal() {
  return (
    <Flex justify="center" align="center">
      <NextBlockCountdown>
        {(progressBarRatio) => <Blocking progressBarRatio={progressBarRatio} />}
      </NextBlockCountdown>
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

  const isEthUnobtrusive = useSelector(ethSelectors.selectorEthUnobtrusive);
  const isGettingWalletInfoUnobtrusive = useSelector(walletSelectors.selectorGettingWalletInfoUnobtrusive);
  const isGettingDemocracyInfoUnobtrusive = useSelector(democracySelectors.selectorGettingDemocracyInfoUnobtrusive);
  const isUnobtrusiveOffices = useSelector(officesSelectors.selectorIsUnobtrusive);
  const isUnobtrusiveIdentity = useSelector(identitySelectors.selectorIsUnobtrusive);
  const isUnobtrusiveLegislation = useSelector(legislationSelectors.gettingLegislationUnobtrusive);
  const isUnobtrusiveValidator = useSelector(validatorSelectors.isUnobtrusive);
  const isUnobtrusiveCongress = useSelector(congressSelectors.isUnobtrusive);
  const isGetRegistriesUnobtrusive = useSelector(registriesSelectors.isGetRegistriesUnobtrusive);
  const isUnobtrusiveDex = useSelector(dexSelectors.selectorIsUnobtrusive);
  const isUnobtrusiveContracts = useSelector(contractsSelectors.selectorIsContractsUnobtrusive);
  const isUnobtrusiveSenate = useSelector(senateSelectors.isUnobtrusive);
  const isUnobtrusiveNfts = useSelector(nftsSelectors.isUnobtrusive);
  const isUnobtrusiveMinistryFinance = useSelector(ministryFinanceSelector.isUnobtrusive);

  const loadingStructure = [
    [isEthLoading, isEthUnobtrusive],
    [isGettingWalletInfo, isGettingWalletInfoUnobtrusive],
    [isGettingDemocracyInfo, isGettingDemocracyInfoUnobtrusive],
    [isLoadingOffices, isUnobtrusiveOffices],
    [isLoadingIdentity, isUnobtrusiveIdentity],
    [isLoadingLegislation, isUnobtrusiveLegislation],
    [isLoadingValidator, isUnobtrusiveValidator],
    [isLoadingCongress, isUnobtrusiveCongress],
    [isGetRegistries, isGetRegistriesUnobtrusive],
    [isLoadingDex, isUnobtrusiveDex],
    [isLoadingContracts, isUnobtrusiveContracts],
    [isLoadingSenate, isUnobtrusiveSenate],
    [isLoadingNfts, isUnobtrusiveNfts],
    [isLoadingMinistryFinance, isUnobtrusiveMinistryFinance],
  ];

  const shouldShowModal = loadingStructure.some(([loading, unobtrusive]) => loading && !unobtrusive);
  const shouldShowUnobtrusive = loadingStructure.some(([loading, unobtrusive]) => loading && unobtrusive);

  useEffect(() => {
    if (shouldShowModal) {
      const id = showModal(<LoadingModal />, { maskClosable: false });
      setModalsId(id);
    }
  }, [shouldShowModal, showModal]);

  useEffect(() => {
    if (!shouldShowModal) {
      closeIdModal(modalId);
    }
  }, [closeIdModal, shouldShowModal, modalId]);

  return (
    <>
      {!shouldShowUnobtrusive ? (
        <Unobtrusive progressBarRatio={100} inactive />
      ) : (
        <NextBlockCountdown>
          {(progressBarRatio) => <Unobtrusive progressBarRatio={progressBarRatio} />}
        </NextBlockCountdown>
      )}
      {children}
      <ErrorModal />
    </>
  );
}

Loader.propTypes = {
  children: PropTypes.node,
};

export default Loader;
