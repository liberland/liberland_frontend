import { ethers } from 'ethers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('ROCP_token'));
    // eslint-disable-next-line no-param-reassign
    if (token) config.headers['X-token'] = token;

    return config;
  },
  (error) => Promise.reject(error),
);

export const getMe = async () => api.get('/users/me');

export const getUsersByAddress = async (blockchainAddress) => {
  const { data } = await api.get('/users', {
    params: {
      blockchainAddress,
    },
  });

  return data.map(({ id, merits, dollars }) => ({
    id,
    merits: ethers.utils.parseUnits(merits.toFixed(12), 12),
    dollars: ethers.utils.parseUnits(dollars.toFixed(12), 12),
  }));
};

// eslint-disable-next-line max-len
export const setCentralizedBackendBlockchainAddress = async (blockchainAddress, userId) => api.patch(`users/${userId}`, {
  blockchainAddress,
});

export const maybeGetApprovedEresidency = async () => {
  try {
    const approvedEresidency = await api.get('/e-residents/approved/me');
    return approvedEresidency.data;
  } catch (e) {
    return { isError: true, errorResponse: e.response };
  }
};

export const addMeritTransaction = async (userId, amount) => {
  await api.post('/merit-transactions', {
    userId,
    amount,
    source: 'blockchain-fe-app',
    comment: 'User onboarding on blockchain',
  });
};

export const addDollarsTransaction = async (userId, amount) => {
  await api.post('/dollar-transactions', {
    userId,
    amount,
    source: 'blockchain-fe-app',
    comment: 'User onboarding on blockchain',
  });
};

export const getReferenda = async () => {
  const { data } = await api.get('/referenda');
  return data;
};

export const addReferendum = async ({
  link, name, description, hash, additionalMetadata, proposerAddress,
}) => api.post('/referenda', { // TODO fix API not to use chainIndex
  link, chainIndex: 0, name, description, hash, additionalMetadata, proposerAddress,
});

export const fetchPendingAdditionalMerits = async () => {
  try {
    const approvedEresidency = await api.get(
      '/users/complex-view?meritsFrom=0.01&claimedOnboardingLld=true&order=userId&attributesNeeded=blockchainAddress',

    );
    return approvedEresidency.data;
  } catch (e) {
    return [];
  }
};
