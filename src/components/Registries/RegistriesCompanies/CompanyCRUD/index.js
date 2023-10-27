import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {registriesSelectors} from "../../../../redux/selectors";
import {newCompanyDataObject} from "../../../../utils/defaultData";
import {buildRegistryForm} from "../../../../utils/registryFormBuilder";
import {registriesActions} from "../../../../redux/actions";

const CompanyCRUD = () => {
  const registryCRUDAction = useSelector(registriesSelectors.registryCRUDAction);

  const dispatch = useDispatch();

  let formObject = {staticFields: [], dynamicFields: []}
  let buttonMessage = ''
  let companyId = false
  let callback = (arg) => {console.log(arg)}
  if (registryCRUDAction.registry == 'company') {
    if(registryCRUDAction.action == 'create'){
      formObject = newCompanyDataObject
      buttonMessage = 'Submit Company Application'
      callback = ((companyData) => {dispatch(registriesActions.requestCompanyRegistrationAction.call(companyData))})
    }
    if(registryCRUDAction.action == 'edit'){
      formObject = registryCRUDAction.dataObject
      buttonMessage = 'Submit Company Edit'
      companyId = registryCRUDAction.dataObject.id
      callback = ((companyData) =>{})
    }
  }

  return (
    <div>
      {buildRegistryForm(formObject, buttonMessage, companyId, callback)}
    </div>)
}

export default CompanyCRUD
