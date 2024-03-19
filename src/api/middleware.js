import axios from 'axios';

const getMiddlewareApi = () => axios.create({
  baseURL: process.env.REACT_APP_MIDDLEWARE_API,
});

export const getComplimentaryLLD = async (usingWalletAddress) => {
  const userToken = JSON.parse(localStorage.getItem('ROCP_token'));
  const middlewareApi = getMiddlewareApi();
  return middlewareApi
    .post('/v1/onboarding', { usingWalletAddress, userToken })
    .catch((e) => e.response);
};

export const generatePdf = async (companyId, pathName, blockNumber) => {
  const middlewareApi = getMiddlewareApi();
  try {
    const response = await middlewareApi.post('/v1/certificate', {
      companyId,
      pathName,
      blockNumber,
    }, {
      responseType: 'blob',
    });
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
