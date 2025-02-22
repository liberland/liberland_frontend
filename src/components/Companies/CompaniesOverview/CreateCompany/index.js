import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { newCompanyDataObject } from '../../../../utils/defaultData';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';

export default function CreateCompany() {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = ((companyData) => {
    dispatch(
      registriesActions.requestCompanyRegistrationAction.call({
        companyData,
        registryAllowedToEdit: true,
        history,
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
