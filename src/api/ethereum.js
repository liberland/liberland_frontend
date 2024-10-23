import { createThirdwebClient, getContract, readContract, prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { injectedProvider } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';
import { providers } from 'ethers';
import { resolveMappedPromises } from '../utils/promise';

const getThirdWebContract = (contractAddress) => {
  const clientId = process.env.REACT_APP_THIRD_WEB_CLIENT_ID;
  const chainId = process.env.REACT_APP_THIRD_WEB_CHAIN_ID;
  const rpcUrl = process.env.REACT_APP_THIRD_WEB_RPC_URL;
  const nativeCurrency = JSON.parse(process.env.REACT_APP_THIRD_WEB_NATIVE_CURRENCY);

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
  return {
    client,
    contract,
    chainId,
  };
};

const resolveOperationFactory = (contractAddress) => async (methodName, params = [], wei = 0) => {
  const { contract, client, chainId } = getThirdWebContract(contractAddress);

  const defaultParams = {
    contract,
    method: methodName,
    params: params,
  };

  const transaction = await prepareContractCall(wei === 0 ? defaultParams : {
    ...defaultParams,
    value: wei,
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account
  });
  await waitForReceipt({
    chain: chainId,
    client,
    transactionHash: transactionHash,
  });
};

const getTokenStakeOperations = async () => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS);

  const claimRewards = () => {
    return resolveOperation("function claimRewards()");
  };

  const stake = (tokens) => {
    return resolveOperation("function stake(uint256 _amount) payable", [tokens], tokens);
  };

  const depositRewardTokens = (tokens) => {
    return resolveOperation("function depositRewardTokens(uint256 _amount) payable", [tokens]);
  };

  const setRewardRatio = (numerator, denominator) => {
    return resolveOperation("function setRewardRatio(uint256 _numerator, uint256 _denominator)", [numerator, denominator]);
  };

  const setTimeUnit = (timeUnit) => {
    return resolveOperation("function setTimeUnit(uint80 _timeUnit)", [timeUnit]);
  };

  const withdraw = (amount) => {
    return resolveOperation("function withdraw(uint256 _amount)", [amount]);
  };

  const withdrawRewardTokens = (amount) => {
    return resolveOperation("function withdrawRewardTokens(uint256 _amount)", [amount]);
  };

  return {
    claimRewards,
    stake,
    depositRewardTokens,
    setRewardRatio,
    setTimeUnit,
    withdraw,
    withdrawRewardTokens,
  };
};

const getTokenStakeAddressInfo = async ({ userEthAddress }) => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS);
  
  const stakeInfo = await readContract({
    contract,
    method: 'function getStakeInfo(address userEthAddress) view returns (uint256 _tokensStaked, uint256 _rewards)',
    params: [userEthAddress],
  });

  return stakeInfo;
};

const getERC20Balance = async ({ erc20Address, account }) => {
  const { contract } = getThirdWebContract(erc20Address);
  return readContract({
    contract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [account]
  });
}

const getERC20Operations = async ({ erc20Address }) => {
  const resolveOperation = resolveOperationFactory(erc20Address);
  const approve = (spender, value) => resolveOperation("function approve(address spender, uint256 value) external returns (bool)", [
    spender, value,
  ]);
  return {
    approve,
  };
};

const getERC20Info = async ({ erc20Address }) => {
  const { contract } = getThirdWebContract(erc20Address);
  const name = readContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });
  const symbol = readContract({
    contract,
    method: "function symbol() view returns (string)",
    params: []
  });
  const decimals = readContract({
    contract,
    method: "function decimals() view returns (uint8)",
    params: []
  });
  const promises = {
    name,
    symbol,
    decimals,
  }
  return resolveMappedPromises(promises);
};

const getTokenStakeContractInfo = async () => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS);
  
  const getRewardRatio = readContract({
    contract,
    method: "function getRewardRatio() view returns (uint256 _numerator, uint256 _denominator)",
    params: []
  });
  
  const getRewardTokenBalance = readContract({
    contract,
    method: "function getRewardTokenBalance() view returns (uint256)",
    params: []
  });
  
  const getTimeUnit = readContract({
    contract,
    method: "function getTimeUnit() view returns (uint80 _timeUnit)",
    params: []
  });

  const rewardToken = readContract({
    contract,
    method: "function rewardToken() view returns (address)",
    params: []
  });

  const rewardTokenDecimals = readContract({
    contract,
    method: "function rewardTokenDecimals() view returns (uint16)",
    params: []
  });

  const stakingToken = readContract({
    contract,
    method: "function stakingToken() view returns (address)",
    params: []
  });

  const stakingTokenBalance = readContract({
    contract,
    method: "function stakingTokenBalance() view returns (uint256)",
    params: []
  });

  const stakingTokenDecimals = readContract({
    contract,
    method: "function stakingTokenDecimals() view returns (uint16)",
    params: []
  });

  const promises = {
    getRewardRatio,
    getRewardTokenBalance,
    getTimeUnit,
    rewardToken,
    rewardTokenDecimals,
    stakingToken,
    stakingTokenDecimals,
    stakingTokenBalance,
  };

  const resolved = await resolveMappedPromises(promises);

  return resolved;
};

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
  connectWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  getTokenStakeOperations,
  getERC20Info,
  getERC20Operations,
  getERC20Balance,
};
