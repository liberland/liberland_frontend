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
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const fetchSpending = async (wallet, skip, take) => {
  try {
    const { data: spendings } = await getMiddlewareApi().get(
      `/v1/government-spendings/${wallet}`,
      {
        params: { skip, take },
      },
    );
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

const fetchSpendingCount = async (wallet) => {
  const { count } = await getMiddlewareApi().get(
    `/v1/government-spendings/${wallet}/count`,
  );
  return count;
};

export const fetchCongressSpendingCount = () => fetchSpendingCount(
  '5EYCAe5g8CDuMsTief7QBxfvzDFEfws6ueXTUhsbx5V81nGH',
);

export const fetchMinistryOfFinanceSpendingCount = () => fetchSpendingCount(
  '5EYCAe5iXF2YZpCZr7ALYUUYaNpMXde3NUXxYn1Sc1YRM4gV',
);

export const fetchCongressSpending = (skip, take) => (
  fetchSpending('5EYCAe5g8CDuMsTief7QBxfvzDFEfws6ueXTUhsbx5V81nGH', skip, take)
);
export const fetchMinistryOfFinanceSpending = (skip, take) => (
  fetchSpending('5EYCAe5iXF2YZpCZr7ALYUUYaNpMXde3NUXxYn1Sc1YRM4gV', skip, take)
);
