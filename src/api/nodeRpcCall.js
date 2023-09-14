import { web3Accounts, web3FromAddress, web3FromSource } from '@polkadot/extension-dapp';
import { blake2AsHex } from '@polkadot/util-crypto';
import { USER_ROLES, userRolesHelper } from '../utils/userRolesHelper';
import {dollarsToGrains, meritsToGrains} from '../utils/walletHelpers';
import {handleMyDispatchErrors} from "../utils/therapist";
import {newCompanyDataObject} from "../utils/defaultData";
import * as centralizedBackend from './backend';
import { BN_TWO } from '@polkadot/util';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);
let __apiCache = null;
const getApi = () => {
  if (__apiCache === null) __apiCache = ApiPromise.create({ provider });
  return __apiCache;
};

const crossReference = (blockchainData, centralizedData) => {
  return blockchainData.map((item) => (
    {
      ...item,
      centralizedData: centralizedData.find((cItem) => (
        parseInt(cItem.chainIndex) == parseInt(item.index)
      )),
    }
  ))
};

const submitExtrinsic = async (extrinsic, walletAddress) => {
  const api = await getApi();
  const { signer } = await web3FromAddress(walletAddress);
  return await new Promise((resolve, reject) => {
    extrinsic.signAndSend(walletAddress, { signer }, ({ status, events, dispatchError }) => {
      const errorData = handleMyDispatchErrors(dispatchError, api)
      if (status.isInBlock) {
        const blockHash = status.asInBlock.toString();
        console.log(errorData, events);
        if(errorData.isError) reject({ blockHash, status, events, errorData });
        else resolve({ blockHash, status, events });
      }
    });
  });
}

const getIdentity = async (address) => {
  try {
    const api = await getApi();
    const identity = await api.query.identity.identityOf(address);
    return identity;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const getLlmBalances = async (addresses) => {
  try {
    const api = await getApi();
    const balances = await api.query.assets.account.multi(addresses.map(a => [1, a]));
    return addresses.reduce((acc, addr, idx) => {
      if (balances[idx].isSome)
        return Object.assign(acc, { [addr]: balances[idx].unwrap().balance })
      else
        return Object.assign(acc, { [addr]: 0 })
    }, {});
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const getLldBalances = async (addresses) => {
  try {
    const api = await getApi();
    const balances = await api.query.system.account.multi(addresses);
    return addresses.reduce((acc, addr, idx) => {
      return Object.assign(acc, { [addr]: balances[idx].data.free })
    }, {});
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const bridgeSubscribe = async (asset, receipt_id, onChange) => {
  const api = await getApi();
  let bridge;
  if (asset == "LLM") bridge = api.query.ethLLMBridge;
  else if (asset == "LLD") bridge = api.query.ethLLDBridge;
  // returns unsub func
  return {
    unsubscribe: await bridge.statusOf(receipt_id, onChange)
  }
} 

const bridgeDeposit = async ({ asset, amount, ethereumRecipient }, walletAddress, callback) => {
  const api = await getApi();
  let bridge;
  if (asset == "LLM") bridge = api.tx.ethLLMBridge;
  else if (asset == "LLD") bridge = api.tx.ethLLDBridge;
  else throw new Exception("Unknown asset");

  const call = bridge.deposit(amount, ethereumRecipient);
  const injector = await web3FromSource('polkadot-js');
  call.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api);
    if (status.isInBlock) {
      callback(null, {
        blockHash: status.asInBlock.toString(),
        status,
        events,
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const bridgeWithdraw = async ({ receipt_id, asset }, walletAddress, callback) => {
  const api = await getApi();
  let bridge;
  if (asset == "LLM") bridge = api.tx.ethLLMBridge;
  else if (asset == "LLD") bridge = api.tx.ethLLDBridge;
  else throw new Exception("Unknown asset");

  const call = bridge.withdraw(receipt_id);
  const injector = await web3FromSource('polkadot-js');
  call.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api);
    if (status.isInBlock) {
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const bridgeConstants = async (asset) => {
  const api = await getApi();
  let bridge;
  if (asset == "LLM") bridge = api.consts.ethLLMBridge;
  else if (asset == "LLD") bridge = api.consts.ethLLDBridge;
  else throw new Exception("Unknown asset");

  return bridge;
}

const provideJudgementAndAssets = async ({ address, hash, walletAddress, merits, dollars }, callback) => {
  const api = await getApi();
  const calls = []

  const judgement = api.createType('IdentityJudgement', 'KnownGood')
  const judgementCall = api.tx.identity.provideJudgement(0, address, judgement, hash);
  const officeJudgementCall = api.tx.identityOffice.execute(judgementCall);
  calls.push(officeJudgementCall)

  if (dollars?.gt(0)) {
    const lldCall = api.tx.balances.transfer(address, dollars.toString());
    const officeLldCall = api.tx.identityOffice.execute(lldCall);
    calls.push(officeLldCall)
  }
  if (merits?.gt(0)) {
    const llmCall = api.tx.llm.sendLlmToPolitipool(address, merits.toString());
    const officeLlmCall = api.tx.identityOffice.execute(llmCall);
    calls.push(officeLlmCall)
  }

  const finalCall = api.tx.utility.batchAll(calls);
  const injector = await web3FromSource('polkadot-js');
  finalCall.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
}

const getLegalAdditionals = (legal) => {
  const chunks = [];
  for (let i = 0; i < legal.length; i += 32) {
    chunks.push([
      {"Raw": "legal"},
      {"Raw": legal.substr(i, 32)}
    ]);
  }
  return chunks;
}

const getCitizenAdditionals = (blockNumber, eligible_on_date) => {
  if(!eligible_on_date) return [];

  const now = Date.now();
  const seconds_till_eligible = eligible_on_date.getTime() - now;
  const blocks_till_eligible = seconds_till_eligible / 6000;
  let eligible_on_bn = blockNumber + blocks_till_eligible;
  eligible_on_bn = eligible_on_bn > 0 ? eligible_on_bn : 0;
  eligible_on_bn = Math.ceil(eligible_on_bn);
  const eligible_on_buf = new ArrayBuffer(4);
  new DataView(eligible_on_buf).setUint32(0, eligible_on_bn, true);
  const eligible_on_bytes = new Uint8Array(eligible_on_buf);

  return [
    [{"Raw": "citizen"}, {"Raw": "1"}],
    [{"Raw": "eligible_on"}, {"Raw": [...eligible_on_bytes]}],
  ];
}

const getEResidentAdditionals = () => {
  return [
    [{"Raw": "eresident"}, {"Raw": "1"}],
  ];
}

const buildAdditionals = (values, blockNumber) => {
  const additionals = []

  if (values.onChainIdentity === "citizen") {
    additionals.push(
        ...getCitizenAdditionals(blockNumber, values.eligible_on),
        ...getEResidentAdditionals()
    )
  } else if (values.onChainIdentity === "eresident") {
    additionals.push(
        ...getEResidentAdditionals()
      )
  }

  if (values.legal) {
    additionals.push(
        ...getLegalAdditionals(values.legal)
    )
  }

  return additionals
}

const setIdentity = async (values, walletAddress, callback) => {
  const asData = v => v ? { Raw: v } : null;
  const api = await getApi();
  const blockNumber = await api.derive.chain.bestNumber();
  const info = {
    additional: buildAdditionals(values, blockNumber.toNumber()),
    display: asData(values.display),
    legal: asData(null),
    web: asData(values.web),
    email: asData(values.email),
    riot: asData(null),
    image: asData(null),
    twitter: asData(null),
  };
  
  const setCall = api.tx.identity.setIdentity(info);
  const injector = await web3FromSource('polkadot-js');
  setCall.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
}

const getCompanyRequest = async (entity_id) => {
  try {
    const api = await getApi();
    const request = await api.query.companyRegistry.requests(0, entity_id);
    return request;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const getCompanyRegistration = async (entity_id) => {
  try {
    const api = await getApi();
    const registration = await api.query.companyRegistry.registries(0, entity_id);
    return registration;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const registerCompany = async ({company_id, hash, walletAddress}, callback) => {
  const api = await getApi();
  const registerCall = api.tx.companyRegistry.registerEntity(0, company_id, hash);
  const proxied = api.tx.companyRegistryOffice.execute(registerCall);
  const injector = await web3FromSource('polkadot-js');
  proxied.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
}

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

const sendTransfer = async (payload, callback) => {
  const { account_to, amount, account_from } = payload;
  const api = await getApi();
  const transferExtrinsic = api.tx.balances.transfer(account_to, (amount));
  const injector = await web3FromSource('polkadot-js');
  transferExtrinsic.signAndSend(account_from, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const sendTransferLLM = async (payload, callback) => {
  const { account_to, amount, account_from } = payload;
  const api = await getApi();
  const transferExtrinsic = api.tx.llm.sendLlm(account_to, (meritsToGrains(amount)));

  const injector = await web3FromSource('polkadot-js');
  transferExtrinsic.signAndSend(account_from, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const stakeToPolkaBondAndExtra = async (payload, callback) => {
  const { values: { amount }, isUserHavePolkaStake, walletAddress } = payload;
  const api = await getApi();
  const transferExtrinsic = isUserHavePolkaStake
    ? await api.tx.staking.bondExtra(dollarsToGrains(amount))
    : await api.tx.staking.bond(dollarsToGrains(amount), 'Staked');

  const injector = await web3FromSource('polkadot-js');
  // eslint-disable-next-line max-len
  await transferExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const unpool = async (walletAddress, callback) => {
  const api = await getApi();
  const unpoolExtrinsic = api.tx.llm.politicsUnlock();

  const injector = await web3FromSource('polkadot-js');
  unpoolExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const politiPool = async (payload, callback) => {
  const { values: { amount }, walletAddress } = payload;
  const api = await getApi();
  const politiPoolExtrinsic = api.tx.llm.politicsLock(meritsToGrains(amount));

  const injector = await web3FromSource('polkadot-js');
  politiPoolExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
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

const getAllWalletsRpc = async () => web3Accounts();

const getValidators = async () => {
  const api = await getApi();
  const validators = [];
  const validatorsKeys = await api.query.staking.validators.keys();
  const validatorQueries = [];
  const validatorIdentityQueries = [];
  validatorsKeys.forEach((validatorKey, index) => {
    const address = validatorKey.toHuman().pop();
    validatorQueries.push([api.query.staking.validators, address]);
    validatorIdentityQueries.push([api.query.identity.identityOf, address]);
    validators[index] = { address };
  });
  const numOfValidators = validatorsKeys.length;
  const validatorsData = await api.queryMulti([
    ...validatorQueries,
    ...validatorIdentityQueries,
  ]);
  validatorsData.forEach((validatorData, index) => {
    const validatorHumanData = validatorData.toHuman();
    const dataToAdd = {
      ...((validatorHumanData?.commission !== undefined) && { commission: validatorHumanData.commission }),
      ...((validatorHumanData?.blocked !== undefined) && { blocked: validatorHumanData.blocked }),
      ...((validatorHumanData?.info?.display?.Raw !== undefined) && { displayName: validatorHumanData?.info?.display?.Raw }),
    };
    validators[index % numOfValidators] = {
      ...validators[index % numOfValidators],
      ...dataToAdd,
    };
  });
  return validators;
};

const getNominatorTargets = async (walletId) => {
  const api = await getApi();
  const nominations = await api.query.staking.nominators(walletId);

  return nominations?.toHuman()?.targets ? nominations?.toHuman()?.targets : [];
};

const setNominatorTargets = async (payload, callback) => {
  const { newNominatorTargets, walletAddress } = payload;
  const injector = await web3FromAddress(walletAddress);
  const api = await getApi();
  const setNewTargets = await api.tx.staking.nominate(newNominatorTargets);
  await setNewTargets.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`InBlock at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const delegateDemocracy = async (delegateeAddress, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();
  const delegateExtrinsic = api.tx.democracy.delegate(delegateeAddress, "None", LLMPolitiPoolData);

  delegateExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed DELEGATE at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const undelegateDemocracy = async (walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const undelegateExtrinsic = api.tx.democracy.undelegate();

  undelegateExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed UNDELEGATE at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const getDemocracyReferendums = async (address) => {
  try {
    const api = await getApi();
    const [
      proposals,
      userVotes,
    ] = await api.queryMulti([
      api.query.democracy.publicProps,
      [api.query.democracy.votingOf, address],
    ]);

    const [
      apideriveReferendums,
      apideriveReferendumsActive,
    ] = await Promise.all([ // api.queryMulti doesnt work with api.derive :(
      api.derive.democracy.referendums(),
      api.derive.democracy.referendumsActive(),
    ]);

    const proposalData = proposals.toHuman().map((proposalItem) => ({
      index: proposalItem[0],
      boundedCall: proposalItem[1],
      proposer: proposalItem[2],
    }));

    const deposits = await api.query.democracy.depositOf.multi(proposalData.map(({ index }) => index));

    const proposalsWithDeposits = proposalData.map((proposal, idx) => (
      {
        seconds: deposits[idx].toHuman()[0],
        ...proposal,
      }
    ));

    let centralizedReferendumsData = await centralizedBackend.getReferenda();

    const crossReferencedReferendumsData = crossReference(
      apideriveReferendums,
      centralizedReferendumsData,
    );

    const crossReferencedProposalsData = crossReference(
      proposalsWithDeposits,
      centralizedReferendumsData,
    );

    return {
      proposalData,
      apideriveReferendums,
      crossReferencedReferendumsData,
      crossReferencedProposalsData,
      apideriveReferendumsActive,
      userVotes: userVotes.toHuman(),
      centralizedReferendumsData,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {};
  }
};

const secondProposal = async (walletAddress, proposal, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const secondExtrinsic = api.tx.democracy.second(proposal);
  secondExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const voteOnReferendum = async (walletAddress, referendumIndex, voteType, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();
  const voteExtrinsic = api.tx.democracy.vote(referendumIndex, {
    Standard: {
      vote: {
        aye: voteType === 'Aye',
        conviction: 1,
      },
      balance: LLMPolitiPoolData,
    },
  });

  voteExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VOTE at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const getProposalHash = async (values, legislationIndex) => {
  const api = await getApi();
  const extrinsicEncoded = api.tx.liberlandLegislation.addLaw(parseInt(values.legislationTier), legislationIndex, values.legislationContent).method.toHex();
  const hash = { encodedHash: blake2AsHex(extrinsicEncoded), extrinsicEncoded };
  return hash;
};

const submitProposal = async (walletAddress, values, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const nextChainIndexQuery = await api.query.democracy.referendumCount();
  const nextChainIndex = nextChainIndexQuery.toHuman();

  const centralizedMetadata = await centralizedBackend.addReferendum({
    link: values.forumLink,
    chainIndex: nextChainIndex,
    name: 'Hardcoded server name',
    description: values.legislationContent,
    hash: 'hash not needed',
    additionalMetadata: {},
    proposerAddress: walletAddress,
  });
  const legislationIndex = centralizedMetadata.data.id;
  const hash = await getProposalHash(values, legislationIndex);
  const notePreimageTx = api.tx.preimage.notePreimage(hash.extrinsicEncoded);
  const minDeposit = api.consts.democracy.minimumDeposit;
  const proposeCall = parseInt(values.legislationTier) === 0 ? api.tx.democracy.proposeRichOrigin : api.tx.democracy.propose;
  const proposeTx = proposeCall({ Legacy: hash.encodedHash }, minDeposit);
  notePreimageTx.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed NOTEPREIMAGE at block hash #${status.asInBlock.toString()}`);
      proposeTx.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
        let errorData = handleMyDispatchErrors(dispatchError, api)
        if (status.isInBlock) {
          // eslint-disable-next-line no-console
          console.log(`Completed PROPOSE at block hash #${status.asInBlock.toString()}`);
          callback(null, {
            blockHash: status.asInBlock.toString(),
            errorData
          });
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(':( transaction PROPOSE failed', error);
        callback({isError: true, details: error.toString()});
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const getCongressMembersWithIdentity = async (walletAddress) => {
  const api = await getApi();
  let [
    councilMembers,
    candidates,
    currentCandidateVotesByUserQuery,
  ] = await api.queryMulti([
    api.query.council.members,
    api.query.elections.candidates,
    [api.query.elections.voting, walletAddress],
  ]);
  councilMembers = councilMembers.toHuman();
  const councilMembersIdentityQueries = [];
  councilMembers.forEach((councilMember) => {
    councilMembersIdentityQueries.push([api.query.identity.identityOf, councilMember]);
  });

  const councilMemberIdentities = councilMembersIdentityQueries.length == 0 ? [] :
    await api.queryMulti([
      ...councilMembersIdentityQueries,
    ]);

  const crossReferencedCouncilMemberIdentities = [];

  councilMemberIdentities.forEach((councilMemberIdentity) => {
    const toHumanIdentity = councilMemberIdentity.toHuman();
    // address use councilmembers.shift as its same ordering as councilmemberidentities
    let rawIdentity = councilMembers.shift();
    rawIdentity = typeof rawIdentity === 'string' ? rawIdentity : rawIdentity[0];
    crossReferencedCouncilMemberIdentities.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity,
    });
  });

  candidates = candidates.toHuman();
  // TODO isolate in function ?
  const candidatesIdentityQueries = [];
  candidates.forEach((candidate) => {
    candidatesIdentityQueries.push([api.query.identity.identityOf, candidate[0]]);
  });

  const candidateIdentities = candidatesIdentityQueries.length == 0 ? [] : await api.queryMulti([
    ...candidatesIdentityQueries,
  ]);

  const crossReferencedCandidateIdentities = [];
  candidateIdentities.forEach((candidateIdentity) => {
    const toHumanIdentity = candidateIdentity.toHuman();
    // address use councilmembers.shift as its same ordering as councilmemberidentities
    let rawIdentity = candidates.shift();
    rawIdentity = typeof rawIdentity === 'string' ? rawIdentity : rawIdentity[0];
    crossReferencedCandidateIdentities.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity,
    });
  });

  const currentCandidateVotesByUser = currentCandidateVotesByUserQuery.toHuman().votes;

  const currentCandidateVotesByUserIdentityQueries = [];
  currentCandidateVotesByUser.forEach((currentCandidateVote) => {
    currentCandidateVotesByUserIdentityQueries.push([api.query.identity.identityOf, currentCandidateVote]);
  });

  const currentCandidateVotesByUserIdentities = currentCandidateVotesByUserIdentityQueries.length == 0 ? [] : await api.queryMulti(
    [
      ...currentCandidateVotesByUserIdentityQueries,
    ],
  );

  const crossReferencedCurrentCandidateVotesByUser = [];
  currentCandidateVotesByUserIdentities.forEach((currentCandidateVoteIdentity) => {
    const toHumanIdentity = currentCandidateVoteIdentity.toHuman();
    // address use councilmembers.shift as its same ordering as councilmemberidentities
    let rawIdentity = currentCandidateVotesByUser.shift();
    rawIdentity = typeof rawIdentity === 'string' ? rawIdentity : rawIdentity[0];
    crossReferencedCurrentCandidateVotesByUser.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity,
    });
  });
  // TODO add runnersup

  /*
   const electionsInfo = useCall<DeriveElectionsInfo>(api.derive.elections.info);
   const allVotes = useCall<Record<string, AccountId[]>>(api.derive.council.votes, undefined, transformVotes);
   */

  return { currentCongressMembers: crossReferencedCouncilMemberIdentities, candidates: crossReferencedCandidateIdentities, currentCandidateVotesByUser: crossReferencedCurrentCandidateVotesByUser };
};

const voteForCongress = async (listofVotes, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const votes = listofVotes.map((vote) => vote.rawIdentity);

  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();

  const voteExtrinsic = api.tx.elections.vote(votes, LLMPolitiPoolData);

  voteExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VOTE at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction VOTE failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const castVetoForLegislation = async (tier, index, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const vetoExtrinsic = api.tx.liberlandLegislation.submitVeto(tier, index);

  vetoExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VETO at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction VETO failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const revertVetoForLegislation = async (tier, index, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const revertVetoExtrinsic = api.tx.liberlandLegislation.revertVeto(tier, index);

  revertVetoExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed REVERT VETO at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction REVERT VETO failed', error);
    callback({isError: true, details: error.toString()});
  });
};

const getLegislation = async (tier) => {
  try {
    const api = await getApi();

    const legislationRaw = await api.query.liberlandLegislation.laws.entries(tier);
    const legislationHuman = legislationRaw.map((x) => ({
      key: x[0].toHuman(), value: x[1].toHuman(),
    }));

    const legislationVetosRawArray = await Promise.all(legislationHuman.map(({ key }) => (
      api.query.liberlandLegislation.vetos.entries(key[0], key[1])
    )));

    const legislationVetosHuman = [];
    legislationVetosRawArray.forEach((rawVetos) => {
      legislationVetosHuman.push(
        rawVetos.map((x) => ({
          vetoInfo: x[0].toHuman(), value: x[1].toHuman(),
        })),
      );
    });

    const vetosByIndex = {};
    legislationVetosHuman.forEach((vetos) => {
      vetos.forEach((veto) => {
        if (veto.vetoInfo[1] in vetosByIndex) {
          vetosByIndex[veto.vetoInfo[1]].push(veto.vetoInfo[2]);
        } else {
          vetosByIndex[veto.vetoInfo[1]] = [veto.vetoInfo[2]];
        }
      });
    });

    const legislation = legislationHuman.map(({ key, value }) => ({
      tier: key[0],
      index: key[1],
      content: value,
      vetos: vetosByIndex[key[1]] ? vetosByIndex[key[1]] : [],
    }));

    return legislation;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {};
  }
};

const getOfficialUserRegistryEntries = async (walletAddress) => {
  const api = await getApi();
  const ownerEntites = await api.query.companyRegistry.ownerEntities.entries(walletAddress)

  const ownerEntitesHuman = ownerEntites.map((x) => ({
    key: x[0].toHuman(), value: x[1].toHuman(),
  }));
  let ownsEntityIds = []
  ownerEntitesHuman.forEach(oe => {
    ownsEntityIds.push(oe['key'][1])
  })
  let requestQueries = []
  let registeredQueries = []
  ownsEntityIds.forEach(entityId => {
    requestQueries.push([api.query.companyRegistry.requests, [0, entityId]])
    registeredQueries.push([api.query.companyRegistry.registries, [0, entityId]])
  })
  let companyRegistryRawData = []
  // Skip queryMulti if no companies, otherwise errors out
  if(ownsEntityIds.length !== 0) {
    companyRegistryRawData = await api.queryMulti([
      ...requestQueries,
      ...registeredQueries
    ])
  }
  let companyRequestsByWallet = []
  let registeredCompaniesByWallet = []
  let supportedObject = JSON.parse(JSON.stringify(newCompanyDataObject))
  companyRegistryRawData.forEach((companyRegistryEntity, index) => {
    const dataToHuman = companyRegistryEntity.toHuman()
    if(dataToHuman){
      let companyData = JSON.parse(dataToHuman.data)
      const staticFields = []
      const dynamicFields = []
      dataToHuman.data = companyData
      supportedObject.staticFields.forEach(staticField => {
        if (staticField.key in companyData){
          let fieldObject = staticField
          fieldObject.display = companyData[staticField.key]
          staticFields.push(fieldObject)
        }
      })
      supportedObject.dynamicFields.forEach(dynamicField => {
        if(dynamicField.key in companyData){
          let fieldObject = dynamicField
          let fieldObjectData = []
          companyData[dynamicField.key].forEach(dynamicFieldDataArray => {
            //Format using fields data
            let crossReferencedFieldDataArray = []
            for(const key in dynamicFieldDataArray){
              if(!key.includes('IsEncrypted')){
                let pushObject = {}
                let keyIsEncrypted = key + 'IsEncrypted'
                pushObject['key'] = key
                pushObject['display'] = dynamicFieldDataArray[key]
                pushObject['isEncrypted'] = dynamicFieldDataArray[keyIsEncrypted]
                crossReferencedFieldDataArray.push(JSON.parse(JSON.stringify(pushObject)))
              }
            }
            fieldObjectData.push(crossReferencedFieldDataArray)
          })

          fieldObject.data = JSON.parse(JSON.stringify(fieldObjectData))
          dynamicFields.push(fieldObject)
        }
      })
      dataToHuman.staticFields = JSON.parse(JSON.stringify(staticFields))
      dataToHuman.dynamicFields = JSON.parse(JSON.stringify(dynamicFields))
      if (index < ownsEntityIds.length){
        let dataObject = {...dataToHuman, id: ownsEntityIds[index]}
        companyRequestsByWallet.push(dataObject)
      } else {
        let dataObject = {...dataToHuman, id: ownsEntityIds[index - ownsEntityIds.length]}
        registeredCompaniesByWallet.push(dataObject)
      }
    }
  })

  const METAVERSTE_NFTs_ID = 1
  const LAND_NFTs_ID = 0

  let metaverseLandForOwner = []
  let landForOwner = []

  let ownerLand = await Promise.all([
    api.query.nfts.account.entries(walletAddress, LAND_NFTs_ID),
    api.query.nfts.account.entries(walletAddress, METAVERSTE_NFTs_ID)
  ])

  const landForOwnerIds = []
  const landMetadataQueries =[]
  const metaverseLandForOwnerIds = []
  const metaverseLandMetadataQueries = []
  const ownerLandHuman = ownerLand[0].map(x => {
    const landObject = { ...x[0].toHuman() }
    landForOwnerIds.push(landObject[2])
    landMetadataQueries.push([api.query.nfts.itemMetadataOf, [LAND_NFTs_ID, parseInt(landObject[2])]])
    return landObject
  });
  const ownerMetaverseLandHuman = ownerLand[1].map(x => {
    const metaverseLandObject = { ...x[0].toHuman() }
    metaverseLandForOwnerIds.push(metaverseLandObject[2])
    metaverseLandMetadataQueries.push([api.query.nfts.itemMetadataOf, [METAVERSTE_NFTs_ID, parseInt(metaverseLandObject[2])]])
    return metaverseLandObject
  });

  let landAttributes = []
  // only query if something to query, otherwise never resolves
  if(landMetadataQueries.length !== 0 || metaverseLandMetadataQueries.length !== 0) {
    landAttributes = await api.queryMulti([
      ...landMetadataQueries,
      ...metaverseLandMetadataQueries
    ])
  }

  landAttributes.forEach((landAttribute, index) => {
    if(index < landForOwnerIds.length) {
      landForOwner.push({id: landForOwnerIds[index], data: landAttribute.toHuman()})
    } else {
      metaverseLandForOwner.push({id: metaverseLandForOwnerIds[index - landForOwnerIds.length], data: landAttribute.toHuman()})
    }
  })

  return {
    companies: {
      registered: registeredCompaniesByWallet,
      requested: companyRequestsByWallet
    },
    land: {
      physical: landForOwner,
      metaverse: metaverseLandForOwner
    },
    assets: [],
    other: []
  }
}

const requestCompanyRegistration = async (walletAddress, companyDataObject, callback)  => {

  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  //TODO read instead of hardcoded true for editablebyregistrar
  const requestCompanyRegistrationExtrinsic = api.tx.companyRegistry.requestEntity(0, JSON.stringify(companyDataObject), true);

  requestCompanyRegistrationExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed REQUEST COMPANY REGISTRATION at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction REQUEST COMPANY REGISTRATION failed', error);
    callback({isError: true, details: error.toString()});
  });
}

const getCitizenCount = async () => {
  try {
    const api = await getApi();
    const count = await api.query.llm.citizens()
    return count.toNumber();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const getLandNFTMetadataJson = async (collection_id, nft_id) => {
  const api = await ApiPromise.create({
    provider,
    types: {
      "Coords": {
        "lat": "u64",
        "long": "u64",
      },
      "LandMetadata": {
        "demarcation": "BoundedVec<Coords, u32>",
        "type": "Text",
        "status": "Text",
      }
    }
  });

  const result = await api.query.nfts.itemMetadataOf(collection_id, nft_id);
  const rawMetadata = result.unwrap().data; // unwrap will fail if there's no metadata for this item
  const metadataUint = api.createType('LandMetadata', rawMetadata).toJSON();
  const metadata = {
    ...metadataUint,
    demarcation: metadataUint.demarcation.map(c => ({
      lat: c.lat/10000000,
      long: c.long/10000000,
    }))
  };
  return metadata;
}
const setLandNFTMetadata = async (collection_id, nft_id, metadata, walletAddress) => {
  const injector = await web3FromAddress(walletAddress);
  const api = await ApiPromise.create({
    provider,
    types: {
      "Coords": {
        "lat": "u64",
        "long": "u64",
      },
      "LandMetadata": {
        "demarcation": "BoundedVec<Coords, u32>",
        "type": "Text",
        "status": "Text",
      }
    }
  });
  /*let metadata = {
    type: "test",
    status: "test",
    demarcation: [
      { lat: 45.7723532, long: 18.8870918 },
      { lat: 45.7721717, long: 18.8871917 },
      { lat: 45.7723330, long: 18.8877504 },
    ]
  };*/

// SCALE doesn't support floats, we need to convert coords to int
  let metadataUint = {
    ...metadata,
    demarcation: metadata.demarcation.map(c => ({
      lat: parseInt(c.lat*10000000),
      long: parseInt(c.long*10000000)
    })),
  };
  let polkadotJsApiObject = api.createType('LandMetadata', metadataUint);
  let scaleEncoded = polkadotJsApiObject.toHex();

  const metadataExtrinsic = api.tx.nfts.setMetadata(collection_id, nft_id, scaleEncoded);
  const officeExtrinsic = api.tx.metaverseLandRegistryOffice.execute(metadataExtrinsic);
// scaleEncoded is ready to be used for setting metadata
// this data will be validated and will be rejected if encoded incorrectly or data is nonsensical (not on liberland island, self-intersecting plot lines, less then 3 points)
  officeExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed REQUEST COMPANY REGISTRATION at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction EDIT METADATA failed', error);
  })
}

const getBlockEvents = async (blockHash) => {
  try {
    const api = await getApi();
    const apiAt = await api.at(blockHash);
    return await apiAt.query.system.events();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

const getMotions = async () => {
  const api = await getApi();
  const proposals = await api.query.council.proposals()
  
  return await Promise.all(
    proposals.map(async proposal => {
      const [proposalOf, voting] = await api.queryMulti([
        [api.query.council.proposalOf, proposal],
        [api.query.council.voting, proposal]
      ])
      return {
        proposal,
        proposalOf,
        voting,
      }
    })
  )
}

const getCongressCandidates = async () => {
  const api = await getApi();
  const electionsCandidates = await api.query.elections.candidates()
  return electionsCandidates.toHuman()
}

const getCongressMembers = async () => {
  const api = await getApi();
  return await api.query.council.members()
}

const getRunnersUp = async () => {
  const api = await getApi();
  return await api.query.elections.runnersUp()
}

const renounceCandidacy = async (walletAddress, userStatus, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  if (userStatus === "None") return;

  const renounce = {[userStatus]: userStatus === "Candidate" ? 
    (await api.query.elections.candidates()).length : null
  }
  const renounceCandidacyTx = await api.tx.elections.renounceCandidacy(
    renounce
  )

  renounceCandidacyTx.signAndSend(walletAddress, { signer: injector.signer }, ({ status, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed elections.submitCandidacy at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( elections.submitCandidacy transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const applyForCongress = async (walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const electionsCandidates = await api.query.elections.candidates()
  const extrinsic = api.tx.elections.submitCandidacy(electionsCandidates.length);

  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed elections.submitCandidacy at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( elections.submitCandidacy transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const voteAtMotions = async (walletAddress, proposal, index, vote, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const extrinsic = api.tx.council.vote(proposal, index, vote);

  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed council.vote at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( council.vote transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const congressMajorityThreshold = async () => {
  const api = await getApi();
  const congressmen = await api.query.council.members()
  return Math.trunc(congressmen.length/2) + 1;
}

const congressSendLlm = async ({ walletAddress, transferToAddress, transferAmount }, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const threshold = await congressMajorityThreshold();
  
  const executeProposal = api.tx.llm.sendLlm(transferToAddress, transferAmount);
  const proposal = api.tx.councilAccount.execute(executeProposal);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);

  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed congress.propose for councilAccount.execute for llm.sendLlm at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( congress.propose for councilAccount.execute for llm.sendLlm transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const congressSendLlmToPolitipool = async ({ walletAddress, transferToAddress, transferAmount }, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const threshold = await congressMajorityThreshold();

  const executeProposal = api.tx.llm.sendLlmToPolitipool(transferToAddress, transferAmount);
  const proposal = api.tx.councilAccount.execute(executeProposal);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);

  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed congress.propose for councilAccount.execute for llm.sendLlmToPolitipool at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( congress.propose for councilAccount.execute for llm.sendLlmToPolitipool transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const batchPayoutStakers = async (targets, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const calls = targets.map(({validator, era}) => api.tx.staking.payoutStakers(validator, era))
  const extrinsic = api.tx.utility.batch(calls);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.payoutStakers batch at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( batched staking.payoutStakers transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const getStakersRewards = async (accounts) => {
  const api = await getApi();

  return await api.derive.staking.stakerRewardsMulti(accounts, false);
}

const getSessionValidators = async () => {
  const api = await getApi();
  const rawData = await api.query.session.validators();
  return rawData.map(v => v.toString());
}

const getNextSessionValidators = async () => {
  const api = await getApi();
  const data = await api.query.session.queuedKeys();
  return data.map(([validator]) => validator.toString());
}

const getStakingValidators = async () => {
  const api = await getApi();
  const rawData = await api.query.staking.validators.keys()
  return rawData.map(v => v.args[0].toString());
}

const getNominators = async () => {
  const api = await getApi();
  return await api.query.staking.nominators.entries();
}

const getStakingLedger = async (controller) => {
  const api = await getApi();
  return await api.query.staking.ledger(controller);
}

const getAppliedSlashes = async () => {
  const api = await getApi();

  return {
    validator: await api.query.staking.validatorSlashInEra.entries(),
    nominator: await api.query.staking.nominatorSlashInEra.entries(),
  }
}

const getUnappliedSlashes = async () => {
  const api = await getApi();
  return await api.query.staking.unappliedSlashes.entries();
}

const setSessionKeys = async (keys, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const EMPTY_PROOF = new Uint8Array();
  const extrinsic = api.tx.session.setKeys(keys, EMPTY_PROOF);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed session.setKeys at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( session.setKeys transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const getStakingPayee = async (stash) => {
  const api = await getApi();

  return await api.query.staking.payee(stash);
}

const setStakingPayee = async (destination, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const extrinsic = api.tx.staking.setPayee(destination);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.setPayee at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( staking.setPayee transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const getIdentities = async (addresses) => {
  const api = await getApi();
  const raw = await api.query.identity.identityOf.multi(addresses);
  return raw.map((identity, idx) => ({
    address: addresses[idx],
    identity: identity.isSome ? identity.unwrap().info : null,
  }));
}

const stakingChill = async (walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const extrinsic = api.tx.staking.chill();
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.chill at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( staking.chill transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const stakingValidate = async (commission, blocked, keys, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const EMPTY_PROOF = new Uint8Array();
  const setKeys = api.tx.session.setKeys(keys, EMPTY_PROOF);
  const validate = api.tx.staking.validate({ commission, blocked });
  const extrinsic = api.tx.utility.batchAll([setKeys, validate]);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.validate at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( staking.validate transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const bondAndValidate = async (bondValue, payee, commission, blocked, keys, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const bond = api.tx.staking.bond(bondValue, payee);
  const EMPTY_PROOF = new Uint8Array();
  const setKeys = api.tx.session.setKeys(keys, EMPTY_PROOF);
  const validate = api.tx.staking.validate({ commission, blocked });
  const extrinsic = api.tx.utility.batchAll([bond, setKeys, validate]);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed bond+setKeys+validate at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( bond+setKeys+validate transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const stakingBond = async (value, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const extrinsic = api.tx.staking.bond(value, 'Staked');
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.bond at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( staking.bond transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const stakingBondExtra = async (value, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);
  const extrinsic = api.tx.staking.bondExtra(value);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed staking.bondExtra at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( staking.bondExtra transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const stakingUnbond = async (value, walletAddress) => {
  const api = await getApi();
  return await submitExtrinsic(api.tx.staking.unbond(value), walletAddress);
}

const stakingWithdrawUnbonded = async (walletAddress) => {
  const api = await getApi();
  const ledger = await api.query.staking.ledger(walletAddress);
  if (ledger.isNone) throw new Error("Account isn't a stash controller!");

  const spans = await api.query.staking.slashingSpans(ledger.unwrap().stash);
  const spanCount = spans.isSome ? spans.unwrap().prior.length + 1 : 0;

  return await submitExtrinsic(api.tx.staking.withdrawUnbonded(spanCount), walletAddress);
}

const subscribeActiveEra = async (onNewEra) => {
  try {
    const api = await getApi();
    const unsub = await api.query.staking.activeEra(onNewEra);
    return unsub;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e);
  }
  return null;
};

const getStakingBondingDuration = async () => {
  const api = await getApi();
  return api.consts.staking.bondingDuration;
}

const congressProposeLegislation = async (tier, index, legislationContent, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const threshold = await congressMajorityThreshold();

  const proposal = api.tx.liberlandLegislation.addLaw(tier, index, legislationContent);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed council.propose for liberlandLegislation.addLaw at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( council.propose for liberlandLegislation.addLaw transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const congressRepealLegislation = async (tier, index, walletAddress, callback) => {
  const api = await getApi();
  const injector = await web3FromAddress(walletAddress);

  const threshold = await congressMajorityThreshold();

  const proposal = api.tx.liberlandLegislation.repealLaw(tier, index);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);
  extrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    let errorData = handleMyDispatchErrors(dispatchError, api)
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed council.propose for liberlandLegislation.repealLaw at block hash #${status.asInBlock.toString()}`);
      callback(null, {
        blockHash: status.asInBlock.toString(),
        errorData
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( council.propose for liberlandLegislation.repealLaw transaction failed', error);
    callback({ isError: true, details: error.toString() });
  });
}

const getTreasurySpendProposals = async () => {
  const api = await getApi();
  return await api.derive.treasury.proposals();
}

const getTreasurySpendPeriod = async () => {
  const api = await getApi();
  return api.consts.treasury.spendPeriod;
}

const getTreasuryBudget = async () => {
  const api = await getApi();
  const account = "5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z";
  const balances = await api.derive.balances.account(account);
  return balances.freeBalance;
}

const congressApproveTreasurySpend = async (proposalId, walletAddress) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();

  const proposal = api.tx.treasury.approveProposal(proposalId);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);
  return await submitExtrinsic(extrinsic, walletAddress);
}

const congressUnapproveTreasurySpend = async (proposalId, walletAddress) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();

  const proposal = api.tx.treasury.removeApproval(proposalId);
  const extrinsic = api.tx.council.propose(threshold, proposal, proposal.length);
  return await submitExtrinsic(extrinsic, walletAddress);
}

const closeCongressMotion = async (proposalHash, index, walletAddress) => {
  const api = await getApi();
  const proposal = await api.query.council.proposalOf(proposalHash);
  /* instead of setting weight to block max, the correct way to calculate
   * weightBound would be:
   * const { weight: weightBound } = await api.tx(proposal.unwrap()).paymentInfo(walletAddress);
   * but this is broken in polkadot-js-api@9.x, and we can't update to
   * polkadot-js-api@10.x as it would require Node.js v18+...
   * BLOCKCHAIN-199
   */
  const weightBound = {
    refTime: api.consts.system.blockWeights.maxBlock.refTime.unwrap().div(BN_TWO),
    proofSize: api.consts.system.blockWeights.maxBlock.proofSize.unwrap().div(BN_TWO),
  };
  const lengthBound = proposal.unwrap().toU8a().length;
  return await submitExtrinsic(api.tx.council.close(proposalHash, index, weightBound, lengthBound), walletAddress);
}

export {
  getBalanceByAddress,
  sendTransfer,
  sendTransferLLM,
  stakeToPolkaBondAndExtra,
  politiPool,
  getUserRoleRpc,
  subscribeBestBlockNumber,
  getAllWalletsRpc,
  getValidators,
  getNominatorTargets,
  setNominatorTargets,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
  submitProposal,
  getCongressMembersWithIdentity,
  voteForCongress,
  getLegislation,
  castVetoForLegislation,
  revertVetoForLegislation,
  getIdentity,
  provideJudgementAndAssets,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
  getOfficialUserRegistryEntries,
  setIdentity,
  requestCompanyRegistration,
  unpool,
  delegateDemocracy,
  undelegateDemocracy,
  getCitizenCount,
  getLandNFTMetadataJson,
  setLandNFTMetadata,
  bridgeWithdraw,
  bridgeSubscribe,
  bridgeDeposit,
  getBlockEvents,
  getLlmBalances,
  getLldBalances,
  bridgeConstants,
  batchPayoutStakers,
  getStakersRewards,
  getSessionValidators,
  getNextSessionValidators,
  getStakingValidators,
  getNominators,
  getStakingLedger,
  getAppliedSlashes,
  getUnappliedSlashes,
  setSessionKeys,
  getStakingPayee,
  setStakingPayee,
  getIdentities,
  applyForCongress,
  getCongressCandidates,
  stakingValidate,
  stakingChill,
  bondAndValidate,
  stakingBond,
  stakingBondExtra,
  getMotions,
  voteAtMotions,
  congressSendLlm,
  congressSendLlmToPolitipool,
  stakingUnbond,
  stakingWithdrawUnbonded,
  subscribeActiveEra,
  getStakingBondingDuration,
  getCongressMembers,
  renounceCandidacy,
  getRunnersUp,
  congressProposeLegislation,
  congressRepealLegislation,
  getTreasurySpendProposals,
  congressApproveTreasurySpend,
  congressUnapproveTreasurySpend,
  getTreasurySpendPeriod,
  getTreasuryBudget,
  closeCongressMotion,
};
