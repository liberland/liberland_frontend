import axios from 'axios';

const getMiddlewareApi = () => axios.create({
  baseURL: process.env.REACT_APP_MIDDLEWARE_API,
});

export const getComplimentaryLLD = async (usingWalletAddress) => {
  const userToken = localStorage.getItem('ssoAccessTokenHash');
  const middlewareApi = getMiddlewareApi();
  return middlewareApi.post('/v1/onboarding', { usingWalletAddress, userToken }).catch((e) => e.response);
};
