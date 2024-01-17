import { setCentralizedBackendBlockchainAddress } from '../api/backend';
import { authActions } from '../redux/actions';

export const setCentralizedBackendAddress = (blockchainAddress, userId, reactHooks) => {
  const ssoAccessTokenHash = sessionStorage.getItem('ssoAccessTokenHash');
  const { dispatch } = reactHooks;
  setCentralizedBackendBlockchainAddress(blockchainAddress, userId, ssoAccessTokenHash).then(() => {
    // TODO FIXME due to api error this will return 500 even if everything is OK, so duplicating logic
    sessionStorage.setItem('userWalletAddress', blockchainAddress);
    dispatch(authActions.verifySession.call());
  }).catch(() => {
    // TODO FIXME due to api error this will return 500 even if everything is OK, so duplicating logic
    sessionStorage.setItem('userWalletAddress', blockchainAddress);
    dispatch(authActions.verifySession.call());
  });
};
