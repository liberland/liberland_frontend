import { isAddress as isEthAddress } from 'thirdweb';
import { blockchainActions, ethActions } from '../actions';

export const setMultichainWallet = (dispatch, walletAddress) => {
  dispatch(blockchainActions.setUserWallet.success(walletAddress));
  if (isEthAddress) {
    dispatch(ethActions.setEthAccount.success(walletAddress));
  }
};
