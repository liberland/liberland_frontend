export const timeoutInterval = 30 * 1000;
export const intervalTime = 1000;
export const lengthOfObject = (object) => Object.keys(object).length;

export const hashToSsoAccessToken = (queryString) => {
  const beginToken = queryString.indexOf('=');
  const endToken = queryString.indexOf('&');
  return queryString.substring(beginToken + 1, endToken);
};

export const checkUnsupportedBrowser = async () => !!((navigator.brave && await navigator.brave.isBrave()) || false);

export const checkIfWalletAddressIsProper = (walletsList, walletAddress) => walletsList.some(
  (wallet) => wallet.address === walletAddress,
);
