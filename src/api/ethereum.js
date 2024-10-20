import { createThirdwebClient, getContract, readContract } from 'thirdweb';
import { createWallet, injectedProvider } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';

const getThirdWebContract = (clientId, chainId, contractAddress) => {
  // create the client with your clientId, or secretKey if in a server environment
  const client = createThirdwebClient({
    clientId,
  });
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: contractAddress,
  });
  return [client, contract];
};

const getTokenAddress = async (contract) => readContract({
  contract,
  method: 'function rewardToken() view returns (address)',
  params: [],
});

const getLPStakeInfo = async (contract, userEthAddress) => readContract({
  contract,
  method: 'function getStakeInfo(address userEthAddress) view returns (uint256 _tokensStaked, uint256 _rewards)',
  params: [userEthAddress],
});
 
const connectWallet = async ({ client, walletId, clientId }) => {
  const wallet = createWallet(clientId); // pass the wallet id
 
  // if user has wallet installed, connect to it
  if (injectedProvider(walletId)) {
    return await wallet.connect({ client });
  } else {
    return await wallet.connect({
      client,
      walletConnect: { showQrModal: true },
    });
  }
};

export {
  getThirdWebContract,
  getTokenAddress,
  getLPStakeInfo,
  connectWallet,
};
