import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { BuildRegistryForm } from '../../../../utils/registryFormBuilder';
import { registriesActions } from '../../../../redux/actions';
import {
  blockchainSelectors,
} from '../../../../redux/selectors';
import { useCompanyDataFromUrl } from '../../hooks';

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
  const { mainDataObject } = useCompanyDataFromUrl();

  if (!mainDataObject) {
    return (
      <div>
        There is no company with this id
      </div>
    );
  }

  const onSubmit = (allCompanyData) => {
    const { registryAllowedToEdit, ...companyData } = allCompanyData;
    dispatch(
      registriesActions.requestEditCompanyRegistrationAction.call({
        companyData,
        companyId,
        history,
        registryAllowedToEdit,
      }),
    );
  };

  return (
    <BuildRegistryForm
      formObject={mainDataObject}
      buttonMessage="Submit Company Application"
      companyId={companyId}
      callback={onSubmit}
    />
  );
}
