import { decodeAndFilter } from '../../utils/identityParser';
import { addReturns, calcInflation, getBaseInfo } from '../../utils/staking';
import { USER_ROLES, userRolesHelper } from '../../utils/userRolesHelper';
import { getApi, submitExtrinsic } from './core';

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
    const api = await getApi();
    const [
      LLDData,
      LLMData,
      LLMPolitiPool,
      electionLock,
    ] = await api.queryMulti([
      [api.query.system.account, address],
      [api.query.assets.account, [1, address]],
      [api.query.llm.llmPolitics, address],
      [api.query.llm.electionlock, address],
    ]);
    const derivedLLDBalances = await api.derive.balances.all(address);
    const LLMPolitiPoolData = LLMPolitiPool.toJSON();
    const LLDWalletData = LLDData.toJSON();
    const LLMWalletData = LLMData.toJSON();

    const LLMBalance = LLMWalletData?.balance ?? '0x0';
    return {
      liberstake: {
        amount: LLMPolitiPoolData,
      },
      polkastake: {
        amount: LLDWalletData.data.frozen ?? LLDWalletData.data.miscFrozen,
      },
      liquidMerits: {
        amount: LLMBalance,
      },
      totalAmount: {
        amount: LLDWalletData.data.free,
      },
      liquidAmount: {
        amount: derivedLLDBalances.availableBalance,
      },
      meritsTotalAmount: {
        amount: LLMBalance,
      },
      electionLock: electionLock.toJSON(),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {};
  }
};

const sendTransfer = async (recipient, amount, walletAddress) => {
  const api = await getApi();
  const transferExtrinsic = api.tx.balances.transfer(recipient, amount);
  return submitExtrinsic(transferExtrinsic, walletAddress, api);
};

const sendAssetTransfer = async (recipient, amount, walletAddress, assetData) => {
  const api = await getApi();
  const transferExtrinsic = api.tx.assets.transfer(parseInt(assetData.index), recipient, amount);
  return submitExtrinsic(transferExtrinsic, walletAddress, api);
};

const sendTransferLLM = async (recipient, amount, userWalletAddress) => {
  const api = await getApi();
  const transferExtrinsic = api.tx.llm.sendLlm(recipient, amount);
  return submitExtrinsic(transferExtrinsic, userWalletAddress, api);
};

const stakeToPolkaBondAndExtra = async (amount, isUserHavePolkaStake, walletAddress) => {
  const api = await getApi();
  const transferExtrinsic = isUserHavePolkaStake
    ? await api.tx.staking.bondExtra(amount)
    : await api.tx.staking.bond(amount, 'Staked');
  return submitExtrinsic(transferExtrinsic, walletAddress, api);
};

const unpool = async (walletAddress) => {
  const api = await getApi();
  const unpoolExtrinsic = api.tx.llm.politicsUnlock();
  return submitExtrinsic(unpoolExtrinsic, walletAddress, api);
};

const politiPool = async (amount, walletAddress) => {
  const api = await getApi();
  const politiPoolExtrinsic = api.tx.llm.politicsLock(amount);
  return submitExtrinsic(politiPoolExtrinsic, walletAddress, api);
};

const getUserRoleRpc = async (walletAddress) => {
  try {
    const api = await getApi();
    const identityResult = await api.query.identity.identityOf(walletAddress);
    const userRoleObject = identityResult?.toHuman()?.info.additional[0];
    if (userRoleObject && (USER_ROLES.includes(userRoleObject[0]?.Raw) && userRoleObject[1]?.Raw === '1')) {
      return userRolesHelper.assignJsIdentity(userRoleObject[0].Raw);
    }
    return { non_citizen: 'non_citizen' };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e);
  }
  return null;
};

const subscribeBestBlockNumber = async (onNewBlockNumber) => {
  try {
    const api = await getApi();
    const unsub = await api.derive.chain.bestNumber((bestNumber) => onNewBlockNumber(bestNumber.toNumber()));
    return unsub;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e);
  }
  return null;
};

function accountsToString(accounts) {
  return accounts.map((account) => account.toString());
}

const getValidator = async (address) => {
  const api = await getApi();
  return api.query.staking.validators(address);
};

const getValidators = async () => {
  const api = await getApi();
  const validators = [];
  const validatorQueries = [];
  const validatorIdentityQueries = [];

  const [elected, waiting, validatorsKeys] = await Promise.all([
    api.derive.staking.electedInfo({
      withController: true, withExposure: true, withPrefs: true, withLedger: true,
    }),
    api.derive.staking.waitingInfo({ withController: true, withPrefs: true, withLedger: true }),
    api.query.staking.validators.keys(),
  ]);

  const totalIssuance = await api.query.balances?.totalIssuance();
  const baseInfo = getBaseInfo(api, elected, waiting);
  const inflation = calcInflation(totalIssuance, baseInfo?.totalStaked);

  baseInfo.validators.forEach(async ({ key }) => {
    validatorQueries.push([api.query.staking.validators, key]);
    validatorIdentityQueries.push([api.query.identity.identityOf, key]);
  });
  const numOfValidators = validatorsKeys.length;
  const validatorsData = await api.queryMulti([
    ...validatorQueries,
    ...validatorIdentityQueries,
  ]);

  const validatorsWithBaseInfo = inflation?.stakedReturn ? addReturns(inflation, baseInfo) : baseInfo;

  validatorsData.forEach((validatorData, index) => {
    const validatorHumanData = validatorData.toHuman();
    const data = validatorData.isSome ? validatorData.unwrap() : null;
    const decodedData = decodeAndFilter(data?.info, ['display']);
    const validatorWithBaseInfo = validatorsWithBaseInfo.validators[index];
    if (!validatorWithBaseInfo) return;
    const dataToAdd = {
      ...((validatorHumanData?.commission !== undefined) && { commission: validatorHumanData.commission }),
      ...((validatorHumanData?.blocked !== undefined) && { blocked: validatorHumanData.blocked }),
      // eslint-disable-next-line max-len
      ...((decodedData?.display !== undefined) && { displayName: decodedData.display }),
      ...validatorWithBaseInfo,
      isWaiting: accountsToString(baseInfo.waitingIds).includes(validatorWithBaseInfo.key),
    };
    validators[index % numOfValidators] = {
      ...validators[index % numOfValidators],
      ...dataToAdd,
    };
  });

  validators.sort((a, b) => {
    if (a.isWaiting && !b.isWaiting) return -1;
    if (!a.isWaiting && b.isWaiting) return 1;
    return 0;
  });
  return validators;
};

const getNominatorTargets = async (walletId) => {
  const api = await getApi();
  const nominations = await api.query.staking.nominators(walletId);

  return nominations?.toHuman()?.targets ? nominations?.toHuman()?.targets : [];
};

const setNominatorTargets = async (payload) => {
  const { newNominatorTargets, walletAddress } = payload;
  const api = await getApi();
  const setNewTargets = await api.tx.staking.nominate(newNominatorTargets);
  return submitExtrinsic(setNewTargets, walletAddress, api);
};

export {
  getBalanceByAddress,
  sendTransfer,
  sendAssetTransfer,
  sendTransferLLM,
  stakeToPolkaBondAndExtra,
  unpool,
  politiPool,
  getUserRoleRpc,
  subscribeBestBlockNumber,
  getValidator,
  getValidators,
  getNominatorTargets,
  setNominatorTargets,
};
