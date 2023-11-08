import React from 'react';
import { useDispatch } from 'react-redux';
import { newCompanyDataObject } from '../../../../utils/defaultData';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';

export default function CreateCompany() {
  const dispatch = useDispatch();

  const onSubmit = ((allCompanyData) => {
    const { registryAllowedToEdit, ...companyData } = allCompanyData;

    dispatch(
      registriesActions.requestCompanyRegistrationAction.call({
        companyData,
        registryAllowedToEdit,
      }),
    );
  });

  return (
    <BuildRegistryForm
      formObject={newCompanyDataObject}
      buttonMessage="Submit Company Application"
      companyId={null}
      callback={onSubmit}
    />
  );
}
