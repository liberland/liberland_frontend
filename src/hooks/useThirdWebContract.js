import React from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { getThirdWebContract } from '../api/ethereum';

const useThirdWebContract = () => {
    const auth = React.useContext(AuthContext);
    return React.useMemo(() => {
        return getThirdWebContract(
            auth.thirdWebClientId,
            auth.thirdWebContractChainId,
            auth.thirdWebContractAddress,
        );
    }, []);
};

export default useThirdWebContract;