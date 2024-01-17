export const hashToSsoAccessToken = (queryString) => {
  const beginToken = queryString.indexOf('=');
  const endToken = queryString.indexOf('&');
  return queryString.substring(beginToken + 1, endToken);
};

export const checkUnsupportedBrowser = async () => !!((navigator.brave && await navigator.brave.isBrave()) || false);
