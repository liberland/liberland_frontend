import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import { registriesSelectors } from '../../redux/selectors';
import { registriesActions } from '../../redux/actions';

export const useCompanyMap = () => {
  const allRegistries = useSelector(registriesSelectors.allRegistries)?.officialRegistryEntries;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  return useMemo(() => (
    groupBy(allRegistries || [], 'id')
  ), [allRegistries]);
};

export const useIsConnected = ({ asset, companyId }) => {
  const allRegistries = useSelector(registriesSelectors.allRegistries);
  const company = allRegistries.officialRegistryEntries?.find((item) => item.id === companyId);
  return company?.relevantAssets?.find(({ assetId }) => assetId?.value?.toString() === asset?.toString());
};
