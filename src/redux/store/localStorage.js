import { initialState } from "../reducers/bridge";

export const bridgeTransfersLocalStorageMiddleware = ({ getState }) => {
    return (next) => (action) => {
        const res = next(action);
        localStorage.setItem('bridgeTransfersToSubstrate', JSON.stringify(
            getState()['bridge']['transfers']['toSubstrate']
        ));
        localStorage.setItem('bridgeTransfersToEthereum', JSON.stringify(
            getState()['bridge']['transfers']['toEthereum']
        ));
        return res;
    };
};


export const initBridgeTransfersStore = () => {
    let state = { bridge: { ...initialState }};
    if (localStorage.getItem("bridgeTransfersToSubstrate") !== null) {
        state.bridge.transfers.toSubstrate = JSON.parse(localStorage.getItem("bridgeTransfersToSubstrate"));
        state.bridge.transfers.toSubstrateInitialized = true;
    }
    if (localStorage.getItem("bridgeTransfersToEthereum") !== null) {
        state.bridge.transfers.toEthereum = JSON.parse(localStorage.getItem("bridgeTransfersToEthereum"));
        state.bridge.transfers.toEthereumInitialized = true;
    }
    return state;
}

