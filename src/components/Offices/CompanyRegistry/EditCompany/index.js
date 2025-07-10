import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { officesActions } from '../../../../redux/actions';
import { officesSelectors } from '../../../../redux/selectors';
import { blockchainDataToFormObject } from '../../../../utils/nodeRpcCall';
import CompaniesForm from '../../../Companies/CompaniesForm';

export default function EditCompany() {
  const { companyId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(officesActions.getCompanyRegistration.call(companyId));
  }, [dispatch, companyId]);
  const registration = useSelector(officesSelectors.selectorCompanyRegistration);
  if (!registration) return 'Loading';
  if (!registration.registration) return <div>Company not registered yet</div>;

  const onSubmit = ((companyData) => {
    dispatch(
      officesActions.setRegisteredCompanyData.call({
        companyData,
        companyId,
        history,
      }),
    );
  });

  const formObject = blockchainDataToFormObject(registration.registration.data);
  return (
    <CompaniesForm
      formObject={formObject}
      buttonMessage="Submit"
      companyId={companyId}
      callback={onSubmit}
    />
  );
}
