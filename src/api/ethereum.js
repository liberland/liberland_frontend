import { createThirdwebClient, getContract, readContract } from 'thirdweb';
import { injectedProvider } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';
import { providers } from 'ethers';

const getThirdWebContract = (clientId, chainId, contractAddress, rpcUrl, nativeCurrency) => {
  // create the client with your clientId, or secretKey if in a server environment
  const client = createThirdwebClient({
    clientId,
  });
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain({
      id: parseInt(chainId),
      rpc: rpcUrl,
      nativeCurrency,
    }),
    address: contractAddress,
  });
  return [client, contract];
};

const getLPStakeInfo = async (contract, userEthAddress) => readContract({
  contract,
  method: 'function getStakeInfo(address userEthAddress) view returns (uint256 _tokensStaked, uint256 _rewards)',
  params: [userEthAddress],
});
 
const connectWallet = async ({ walletId }) => { 
  const injected = injectedProvider(walletId);

  if (!injected) {
    throw `${walletId} provider not found`;
  }

  const provider = new providers.Web3Provider(injected);
  await injected.request({ method: "eth_requestAccounts" });
  return {
    provider,
    accounts: await provider.listAccounts(),
  };
};

export {
  getThirdWebContract,
  getLPStakeInfo,
  connectWallet,
};
