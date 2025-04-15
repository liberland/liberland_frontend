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

export const getFinancialMetrics = async () => {
  const middlewareApi = getMiddlewareApi();
  try {
    const response = await middlewareApi.get('/v1/lld-stats');
    const totalIssuance = await middlewareApi.get('/v1/total-issuance/lld');
    return {
      ...response.data,
      totalLld: totalIssuance.data,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const fetchSpending = async (wallet) => {
  try {
    const { data: spendingText } = await getMiddlewareApi().get(
      `/v1/government-spendings/${wallet}`,
    );
    const [, ...spendings] = JSON.parse(spendingText);
    return spendings.map((spending) => ({
      timestamp: new Date(spending[0]),
      recipient: spending[1],
      asset: spending[2],
      value: spending[3],
      category: spending[4],
      project: spending[5],
      supplier: spending[6],
      description: spending[7],
      finalDestination: spending[8],
      amountInUsd: spending[9],
    }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return [];
  }
};

export const fetchCongressSpending = () => fetchSpending('5EYCAe5g8CDuMsTief7QBxfvzDFEfws6ueXTUhsbx5V81nGH');
export const fetchMinistryOfFinanceSpending = () => fetchSpending('5EYCAe5iXF2YZpCZr7ALYUUYaNpMXde3NUXxYn1Sc1YRM4gV');
