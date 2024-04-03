import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';
import {
  registriesSelectors,
  blockchainSelectors,
} from '../../../../redux/selectors';

export default function EditCompany() {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
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
  const registeredCompanyData = companies?.find((item) => item.id === companyId);

  if (!registeredCompanyData) {
    return (
      <div>
        There is no company with this id
      </div>
    );
  }

  const onSubmit = (companyData) => {
    dispatch(
      registriesActions.requestEditCompanyRegistrationAction.call({
        companyData,
        companyId,
        history,
      }),
    );
  };

  return (
    <BuildRegistryForm
      formObject={registeredCompanyData}
      buttonMessage="Submit Company Application"
      companyId={companyId}
      callback={onSubmit}
    />
  );
}
