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
  const history = useHistory()
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  useEffect(() => {
    dispatch(
      registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress),
    );
  }, [dispatch, registriesActions]);
  const registries = useSelector(registriesSelectors.registries);

  const requestType = window.location.hash.substring(1);
  const registeredCompanyData = registries?.officialUserRegistryEntries?.companies?.[requestType][
    Number(companyId)
  ];

  if (!registeredCompanyData) return null;

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
