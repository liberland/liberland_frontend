import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';
import { registriesSelectors, blockchainSelectors } from '../../../../redux/selectors';

export default function EditCompany() {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);
  const registries = useSelector(registriesSelectors.registries);

  const registeredCompanyData = registries?.officialUserRegistryEntries?.companies?.requested.find(
    (company) => company.id === companyId,
  );

  if (!registeredCompanyData) return null;

  const onSubmit = ((companyData) => {
    dispatch(
      registriesActions.requestEditCompanyRegistrationAction.call({
        companyData,
        companyId,
      }),
    );
  });

  return (
    <BuildRegistryForm
      formObject={registeredCompanyData}
      buttonMessage="Submit Company Application"
      companyId={companyId}
      callback={onSubmit}
    />
  );
}
