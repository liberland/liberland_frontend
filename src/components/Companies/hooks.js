import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { blockchainSelectors, registriesSelectors } from '../../redux/selectors';
import { registriesActions } from '../../redux/actions';

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
