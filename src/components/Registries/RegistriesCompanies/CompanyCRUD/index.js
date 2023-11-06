import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { registriesSelectors } from '../../../../redux/selectors';
import { newCompanyDataObject } from '../../../../utils/defaultData';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';

function CompanyCRUD() {
  const history = useHistory();
  const dispatch = useDispatch();

  const onSubmit = ((companyData) => {
    dispatch(
      registriesActions.requestCompanyRegistrationAction.call({
        companyData,
        history,
      }),
    );
  });

  return (
    <div>
      <BuildRegistryForm
        formObject={newCompanyDataObject}
        buttonMessage="Submit Company Application"
        companyId={false}
        callback={onSubmit}
      />
    </div>
  );
}

export default CompanyCRUD;
