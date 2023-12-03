import axios from 'axios';
import { ethers } from 'ethers';

const getApi = () => {
  const ssoAccessTokenHash = sessionStorage.getItem('ssoAccessTokenHash');

  const api = axios.create({
    baseURL: process.env.REACT_APP_API2,
    withCredentials: true,
  });
  api.defaults.headers.common['X-Token'] = ssoAccessTokenHash;

  return api;
};

export const getUsersByAddress = async (blockchainAddress) => {
  const api = getApi();

  const { data } = await api.get('/users', {
    params: {
      blockchainAddress,
    },
  });

  return data.map(({ uid, merits }) => ({
    uid,
    merits: ethers.utils.parseUnits(merits.toFixed(12), 12),
  }));
};

export const maybeGetApprovedEresidency = async () => {
  const api = getApi();
  try {
    const approvedEresidency = await api.get('/e-residents/approved/meghj');
    return approvedEresidency.data;
  } catch (e) {
    return { isError: true, errorResponse: e.response };
  }
};

export const addMeritTransaction = async (userId, amount) => {
  const api = getApi();

  const formattedAmount = ethers.utils.formatUnits(amount, 12);
  await api.post('/merit-transactions', {
    userId,
    amount: formattedAmount,
    source: 'blockchain-fe-app',
    comment: 'User onboarding on blockchain',
  });
};

export const getReferenda = async () => {
  const api = getApi();
  const { data } = await api.get('/referenda');
  return data;
};

export const addReferendum = async ({
  link, chainIndex, name, description, hash, additionalMetadata, proposerAddress,
}) => {
  const api = getApi();
  return await api.post('/referenda', {
    link, chainIndex, name, description, hash, additionalMetadata, proposerAddress,
  });
};
