import { initialState } from '../reducers/bridge';

export const bridgeTransfersLocalStorageMiddleware = ({ getState }) => (next) => (action) => {
  const res = next(action);
  localStorage.setItem('bridgeTransfersToSubstrate', JSON.stringify(
    getState().bridge.transfers.toSubstrate,
  ));
  localStorage.setItem('bridgeTransfersToEthereum', JSON.stringify(
    getState().bridge.transfers.toEthereum,
  ));
  return res;
};

export const initBridgeTransfersStore = async () => {
  const state = { bridge: { ...initialState } };
  const bridgeTransfersToSubstrate = localStorage.getItem('bridgeTransfersToSubstrate');
  if (bridgeTransfersToSubstrate !== null) {
    const parsedLocalStorageData = await JSON.parse(bridgeTransfersToSubstrate);
    state.bridge.transfers.toSubstrate = Object.assign(parsedLocalStorageData, state.bridge.transfers.toSubstrate);
  }
  const bridgeTransfersToEthereum = localStorage.getItem('bridgeTransfersToEthereum');
  if (bridgeTransfersToEthereum !== null) {
    const parsedLocalStorageData = await JSON.parse(bridgeTransfersToEthereum);
    state.bridge.transfers.toEthereum = Object.assign(parsedLocalStorageData, state.bridge.transfers.toEthereum);
  }
  return state;
};
