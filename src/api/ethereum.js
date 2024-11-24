import {
  createThirdwebClient,
  getContract,
  readContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from 'thirdweb';
import { getAllWalletsList, injectedProvider } from 'thirdweb/wallets';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
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
  const chain = defineChain({
    id: parseInt(chainId),
    rpc: rpcUrl,
    nativeCurrency,
  });
  // connect to your contract
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
  });

  return {
    client,
    contract,
    chain,
  };
};

const resolveOperationFactory = (contractAddress, account) => async (methodName, params = [], wei = 0) => {
  const { contract, client, chain } = getThirdWebContract(contractAddress);

  const defaultParams = {
    contract,
    method: methodName,
    params,
  };

  const transaction = await prepareContractCall(wei === 0 ? defaultParams : {
    ...defaultParams,
    value: wei,
  });
  const adaptedAccount = await ethers5Adapter.signer.fromEthers({
    signer: account,
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: adaptedAccount,
  });
  await waitForReceipt({
    chain,
    client,
    transactionHash,
    maxBlocksWaitTime: 20,
  });
};

const getOwnNftPrimeCount = async ({ account }) => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS);
  const address = await account.getAddress();
  return {
    length: await readContract({
      contract,
      method: 'function balanceOf(address owner) view returns (uint256)',
      params: [address],
    }),
    address,
  };
};

const getOwnNftPrimes = async ({ account, from, to }) => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS);
  const address = await account.getAddress();
  const [primes, ids] = await readContract({
    contract,
    // eslint-disable-next-line max-len
    method: 'function getPrimesOwnedBy(address owner, uint256 from, uint256 to) view returns(BigNumber[] memory,uint256[] memory)',
    params: [address, from, to],
  });

  return {
    primes: primes.map((p, i) => ({
      ...p,
      id: ids[i],
    })),
    from,
    to,
    address,
  };
};

const getNftPrimesCount = async () => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS);
  const length = await readContract({
    contract,
    method: 'function getPrimesCount() view returns(uint256)',
    params: [],
  });
  return { length };
};

const getNftPrimes = async ({ from, to }) => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS);
  return {
    primes: await readContract({
      contract,
      method: 'function getPrimes(uint256 from, uint256 to) view returns (BigNumber[] memory)',
      params: [from, to],
    }),
    from,
    to,
  };
};

const mintNft = async ({
  account,
  number,
  d,
  s,
}) => {
  const resolveFactory = resolveOperationFactory(
    process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS,
    account,
  );
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_ADDRESS);
  const fee = await readContract({
    contract,
    method: 'function getFee() view returns(uint256)',
    params: [],
  });
  await resolveFactory(
    'function mint(bytes calldata number, bytes calldata d, uint256 s) payable',
    [number, d, s],
    fee,
  );
};

const erc20Approve = async (erc20Address, account, spender, value) => {
  const resolveOperation = resolveOperationFactory(erc20Address, account);
  await resolveOperation(
    'function approve(address spender, uint256 value) external returns (bool)',
    [
      spender, value,
    ],
  );
};

const stakeTokens = async (account, erc20Address, tokens) => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, account);
  await erc20Approve(erc20Address, account, process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, tokens);
  await resolveOperation('function stake(uint256 _amount) payable', [tokens]);
};

const claimRewards = async (account) => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, account);
  await resolveOperation('function claimRewards()');
};

const withdrawTokens = async (account, amount) => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, account);
  await resolveOperation('function withdraw(uint256 _amount)', [amount]);
};

const getTokenStakeAddressInfo = async ({ userEthAddress }) => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS);

  return {
    stake: await readContract({
      contract,
      method: 'function getStakeInfo(address userEthAddress) view returns (uint256 _tokensStaked, uint256 _rewards)',
      params: [userEthAddress],
    }),
  };
};

const getERC20Balance = async ({ erc20Address, account }) => {
  const { contract } = getThirdWebContract(erc20Address);
  return {
    balance: await readContract({
      contract,
      method: 'function balanceOf(address account) view returns (uint256)',
      params: [account],
    }),
  };
};

const getERC20Info = async ({ erc20Address }) => {
  const { contract } = getThirdWebContract(erc20Address);
  const name = readContract({
    contract,
    method: 'function name() view returns (string)',
    params: [],
  });
  const symbol = readContract({
    contract,
    method: 'function symbol() view returns (string)',
    params: [],
  });
  const decimals = readContract({
    contract,
    method: 'function decimals() view returns (uint8)',
    params: [],
  });
  const promises = {
    name,
    symbol,
    decimals,
  };

  const resolved = await resolveMappedPromises(promises);

  return resolved;
};

const getTokenStakeContractInfo = async () => {
  const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS);

  const getRewardRatio = readContract({
    contract,
    method: 'function getRewardRatio() view returns (uint256 _numerator, uint256 _denominator)',
    params: [],
  });

  const getRewardTokenBalance = readContract({
    contract,
    method: 'function getRewardTokenBalance() view returns (uint256)',
    params: [],
  });

  const getTimeUnit = readContract({
    contract,
    method: 'function getTimeUnit() view returns (uint80 _timeUnit)',
    params: [],
  });

  const rewardToken = readContract({
    contract,
    method: 'function rewardToken() view returns (address)',
    params: [],
  });

  const rewardTokenDecimals = readContract({
    contract,
    method: 'function rewardTokenDecimals() view returns (uint16)',
    params: [],
  });

  const stakingToken = readContract({
    contract,
    method: 'function stakingToken() view returns (address)',
    params: [],
  });

  const stakingTokenBalance = readContract({
    contract,
    method: 'function stakingTokenBalance() view returns (uint256)',
    params: [],
  });

  const stakingTokenDecimals = readContract({
    contract,
    method: 'function stakingTokenDecimals() view returns (uint16)',
    params: [],
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
  try {
    const injected = injectedProvider(walletId);

    if (!injected) {
      throw new Error(`${walletId} provider not found`);
    }

    const provider = new providers.Web3Provider(injected);
    await injected.request({ method: 'eth_requestAccounts' });

    return {
      provider,
      accounts: await provider.listAccounts(),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getAvailableWallets = async () => {
  const walletOptions = await getAllWalletsList();
  return walletOptions.filter(({ id }) => injectedProvider(id));
};

export {
  getThirdWebContract,
  connectWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  stakeTokens,
  claimRewards,
  getERC20Info,
  getERC20Balance,
  getAvailableWallets,
  withdrawTokens,
  getOwnNftPrimeCount,
  getOwnNftPrimes,
  getNftPrimesCount,
  getNftPrimes,
  mintNft,
};
