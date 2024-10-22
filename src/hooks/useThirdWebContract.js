import React from 'react';
import { getThirdWebContract } from '../api/ethereum';

const useThirdWebContract = () => {
    return React.useMemo(() => {
        return getThirdWebContract(
            process.env.REACT_APP_THIRD_WEB_CLIENT_ID,
            process.env.REACT_APP_THIRD_WEB_CHAIN_ID,
            process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS,
            process.env.REACT_APP_THIRD_WEB_RPC_URL,
            JSON.parse(process.env.REACT_APP_THIRD_WEB_NATIVE_CURRENCY),
        );
    }, []);
};

export default useThirdWebContract;