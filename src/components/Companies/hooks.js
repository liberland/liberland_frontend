import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  blockchainSelectors,
  dexSelectors,
  registriesSelectors,
  walletSelectors,
} from '../../redux/selectors';
import { dexActions, registriesActions, walletActions } from '../../redux/actions';
import { isCompanyConnected } from '../../utils/asset';
import { valueToBN } from '../../utils/walletHelpers';

export const useCompanyDataFromUrl = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const registries = useSelector(registriesSelectors.registries);
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  useEffect(() => {
    dispatch(
      registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress),
    );
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch, userWalletAddress]);

  const allRegistries = useSelector(registriesSelectors.allRegistries);

  const company = allRegistries.officialRegistryEntries?.find((item) => item.id === companyId);
  const request = registries?.officialUserRegistryEntries?.companies?.requested?.find((item) => item.id === companyId);

  if (request) {
    return { mainDataObject: request, request: true };
  }
  return { mainDataObject: company, request: false };
};

export const useCompanyAssets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  return useCallback((registeredCompany) => {
    if (additionalAssets && registeredCompany) {
      return additionalAssets.reduce(([connected, relevant], asset) => {
        const { company } = asset;
        if (!company || company.id?.toString() !== registeredCompany.id?.toString()) {
          return [connected, relevant];
        }
        if (isCompanyConnected(asset)) {
          connected.push(asset);
        } else {
          relevant.push(asset);
        }
        return [connected, relevant];
      }, [[], []]);
    }
    return [[], []];
  }, [additionalAssets]);
};

export const useTradePools = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch]);
  const dexs = useSelector(dexSelectors.selectorDex);
  return useCallback((index) => {
    const { poolsData, assetsPoolsData } = dexs || {};
    return poolsData?.filter(
      ({ asset1, asset2 }) => asset1 === index?.toString() || asset2 === index?.toString(),
    ).sort(({ lpToken: aToken }, { lpToken: bToken }) => {
      const aLiq = valueToBN(assetsPoolsData[aToken]?.supply || '0');
      const bLiq = valueToBN(assetsPoolsData[bToken]?.supply || '0');
      return bLiq.gt(aLiq) ? 1 : -1;
    });
  }, [dexs]);
};
