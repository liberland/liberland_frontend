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
import bigSqrt from 'bigint-isqrt';
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

const getSwapExchangeRate = async () => {
  const min = (aBigInt, bBigInt) => (aBigInt > bBigInt ? bBigInt : aBigInt);
  const max = (aBigInt, bBigInt) => (aBigInt > bBigInt ? aBigInt : bBigInt);
  const emptyLP = ({ eth, tokenAmount }) => {
    const multiply = window.BigInt(eth) * window.BigInt(tokenAmount);
    const sqrt = bigSqrt(multiply);
    const zeroOrGreater = max(0, sqrt - window.BigInt(1000));
    return zeroOrGreater;
  };
  const emptyToken = (rate) => rate;
  const emptyOperation = {
    rewardRate: emptyLP,
    tokenRate: emptyToken,
    ethRate: emptyToken,
  };

  try {
    const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_UNISWAP_FACTORY_ADDRESS);
    const pair = await readContract({
      contract,
      method: 'function getPair(address token1, address token2) public returns (address pair)',
      params: [
        process.env.REACT_APP_THIRD_WEB_WETH_ADDRESS,
        process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      ],
    });
    if (pair) {
      const { contract: pairContract } = getThirdWebContract(pair);
      const totalSupply = await readContract({
        contract: pairContract,
        method: 'function totalSupply() public view returns (uint totalSupply)',
        params: [],
      });
      if (totalSupply === '0') {
        return emptyOperation;
      }
      const [
        reserve0,
        reserve1,
      ] = await readContract({
        contract: pairContract,
        // eslint-disable-next-line max-len
        method: 'function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)',
        params: [],
      });

      return {
        rewardRate: ({ eth, tokenAmount }) => min(
          (window.BigInt(eth) * window.BigInt(totalSupply)) / window.BigInt(reserve1),
          (window.BigInt(tokenAmount) * window.BigInt(totalSupply)) / window.BigInt(reserve0),
        ),
        tokenRate: (amount) => (window.BigInt(amount) * window.BigInt(reserve0)) / window.BigInt(reserve1),
        ethRate: (amount) => (window.BigInt(amount) * window.BigInt(reserve1)) / window.BigInt(reserve0),
      };
    }

    return emptyOperation;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return emptyOperation;
  }
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

const stakeTokens = async ({ account, erc20Address, tokens }) => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, account);
  await erc20Approve(erc20Address, account, process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, tokens);
  await resolveOperation('function stake(uint256 _amount) payable', [tokens]);
};

const tryGetPairAndBalance = async (account) => {
  try {
    const { contract } = getThirdWebContract(process.env.REACT_APP_THIRD_WEB_UNISWAP_FACTORY_ADDRESS);
    const pair = await readContract({
      contract,
      method: 'function getPair(address token1, address token2) public returns (address pair)',
      params: [
        process.env.REACT_APP_THIRD_WEB_WETH_ADDRESS,
        process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      ],
    });
    const { balance } = await getERC20Balance({
      erc20Address: pair,
      account: await account.getAddress(),
    });
    return [pair, balance];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return [false, 0];
  }
};

const stakeLPWithEth = async ({
  account,
  ethAmount,
  ethAmountMin,
  tokenAmount,
  tokenAmountMin,
  provider,
}) => {
  await erc20Approve(
    process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
    account,
    process.env.REACT_APP_THIRD_WEB_UNISWAP_ROUTER_ADDRESS,
    tokenAmount,
  );
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_UNISWAP_ROUTER_ADDRESS, account);
  const { timestamp } = await provider.getBlock();
  const dateFromTimestamp = new Date(timestamp * 1000);
  dateFromTimestamp.setMinutes(dateFromTimestamp.getMinutes() + 20);
  const deadline = dateFromTimestamp.getTime() / 1000;
  const balance = (await tryGetPairAndBalance(account))[1];
  await resolveOperation(
    // eslint-disable-next-line max-len
    'function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)',
    [
      process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      tokenAmount,
      tokenAmountMin,
      ethAmountMin,
      await account.getAddress(),
      deadline,
    ],
    ethAmount,
  );
  const [pair, balance1] = await tryGetPairAndBalance(account);
  const liquidity = window.BigInt(balance1) - window.BigInt(balance);
  await stakeTokens(account, pair, liquidity);

  return liquidity;
};

const claimRewards = async (account) => {
  const resolveOperation = resolveOperationFactory(process.env.REACT_APP_THIRD_WEB_CONTRACT_ADDRESS, account);
  await resolveOperation('function claimRewards()');
};

const withdrawTokens = async ({ account, amount }) => {
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

const getBalance = async ({ provider, address }) => {
  try {
    const balance = (await provider.getBalance(address)).toString();
    return {
      balance,
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
  getBalance,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  stakeTokens,
  claimRewards,
  getERC20Info,
  getERC20Balance,
  getAvailableWallets,
  withdrawTokens,
  getSwapExchangeRate,
  stakeLPWithEth,
};
