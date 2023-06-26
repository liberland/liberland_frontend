import { initialState } from "../reducers/bridge";

export const bridgeTransfersLocalStorageMiddleware = ({ getState }) => {
    return (next) => (action) => {
        const res = next(action);
        localStorage.setItem('bridgeTransfers', JSON.stringify(
            getState()['bridge']['transfers']
        ));
        return res;
    };
};


export const initBridgeTransfersStore = () => {
    if (localStorage.getItem("bridgeTransfers") !== null) {
        return {
            bridge: {
                ...initialState,
                transfers: JSON.parse(localStorage.getItem("bridgeTransfers"))
            }
        };
    }
}

