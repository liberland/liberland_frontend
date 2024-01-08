import { ethers } from 'ethers';
import api from './index';

export const getUsersByAddress = async (blockchainAddress) => {
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

export const setCentralizedBackendBlockchainAddress = async (blockchainAddress, userId, ssoAccessTokenHash) => {
  return await api.patch('users/' + userId , {
    blockchainAddress: blockchainAddress
  })
}

export const maybeGetApprovedEresidency = async () => {
  try {
    const approvedEresidency = await api.get('/e-residents/approved/me');
    return approvedEresidency.data;
  } catch (e) {
    return { isError: true, errorResponse: e.response };
  }
};

export const addMeritTransaction = async (userId, amount) => {
  const formattedAmount = ethers.utils.formatUnits(amount, 12);
  await api.post('/merit-transactions', {
    userId,
    amount: formattedAmount,
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
