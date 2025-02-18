import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { newCompanyDataObject } from '../../../../utils/defaultData';
import { registriesActions } from '../../../../redux/actions';
import CompaniesForm from '../../CompaniesForm';

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
    <CompaniesForm
      formObject={newCompanyDataObject}
      buttonMessage="Submit Company Application"
      companyId={null}
      callback={onSubmit}
    />
  );
}
