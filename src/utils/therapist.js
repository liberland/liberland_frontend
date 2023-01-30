import {blockchainActions} from "../redux/actions";
import {put} from "redux-saga/effects";

export const handleMyDispatchErrors = (dispatchError, api) => {
  let errorData = {
    isError: false,
    details: ''
  }
  if (dispatchError) {
    if (dispatchError.isModule) {
      // for module errors, we have the section indexed, lookup
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      const { docs, name, section } = decoded;
      errorData.isError = true
      errorData.details =`${section}.${name}: ${docs.join(' ')}`
    } else {
      // Other, CannotLookup, BadOrigin, no extra info
      errorData.isError = true
      errorData.details = dispatchError.toString()
    }
  }
  return errorData
}
