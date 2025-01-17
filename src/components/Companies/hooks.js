import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { blockchainSelectors, registriesSelectors } from '../../redux/selectors';
import { registriesActions } from '../../redux/actions';

export const useCompanyDataFromUrl = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  useEffect(() => {
    dispatch(
      registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress),
    );
  }, [dispatch, userWalletAddress]);
  const registries = useSelector(registriesSelectors.registries);
  const requestType = window.location.hash.substring(1);
  const companies = registries?.officialUserRegistryEntries?.companies?.[requestType];
  return companies?.find((item) => item.id === companyId);
};
