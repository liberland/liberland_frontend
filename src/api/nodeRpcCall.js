import { web3Accounts, web3FromAddress, web3FromSource } from '@polkadot/extension-dapp';
import { BN, BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import axios from 'axios';
import { USER_ROLES, userRolesHelper } from '../utils/userRolesHelper';
import { meritsToGrains } from '../utils/walletHelpers';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
    const api = await ApiPromise.create({ provider });
    // TODO get this in one transaction?
    const LLDData = await api.query.system.account(address);
    const LLMData = await api.query.assets.account(1, address);
    const LLMPolitiPool = await api.query.llm.llmPolitics(address);
    const LLMPolitiPoolData = LLMPolitiPool.toJSON();
    const LLDWalletData = LLDData.toJSON();
    const LLMWalletData = LLMData.toJSON();

    const LLMBalance = LLMWalletData?.balance ?? 0;

    return {
      liberstake: {
        amount: LLMPolitiPoolData,
      },
      polkastake: {
        amount: LLDWalletData.data.miscFrozen,
      },
      liquidMerits: {
        amount: LLMBalance,
      },
      totalAmount: {
        amount: LLDWalletData.data.free,
      },
      meritsTotalAmount: {
        amount: LLMBalance,
      },
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

const sendTransfer = async (payload, callback) => {
  console.log('payload')
  console.log(payload)
  const { account_to, amount, account_from } = payload;
  const api = await ApiPromise.create({ provider });
  const transferExtrinsic = api.tx.balances.transfer(account_to, (amount));
  const injector = await web3FromSource('polkadot-js');
  transferExtrinsic.signAndSend(account_from, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    console.log('dispatchError')
    console.log(dispatchError)
    console.log('events')
    console.log(events)
    events.forEach(event => {
      console.log('event.method')
      console.log(event.method)
    })
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, status.asInBlock.toString());
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
    callback(error);
  });
};

const sendTransferLLM = async (payload, callback) => {
  console.log('callback');
  console.log(callback);
  const { account_to, amount, account_from } = payload;
  const api = await ApiPromise.create({ provider });
  const transferExtrinsic = api.tx.llm.sendLlm(account_to, (meritsToGrains(amount)));

  const injector = await web3FromSource('polkadot-js');
  transferExtrinsic.signAndSend(account_from, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, status.asInBlock.toString());
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
    callback(error);
  });
};

const stakeToPolkaBondAndExtra = async (payload, callback) => {
  try {
    const { values: { amount }, isUserHaveStake, walletAddress } = payload;
    const api = await ApiPromise.create({ provider });
    const transferExtrinsic = isUserHaveStake
      ? await api.tx.staking.bondExtra(`${amount}000000000000`)
      : await api.tx.staking.bond(walletAddress, `${amount}000000000000`, 'Staked');

    const injector = await web3FromSource('polkadot-js');
    // eslint-disable-next-line max-len
    await transferExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
      if (status.isInBlock) {
        // eslint-disable-next-line no-console
        console.log(`InBlock at block hash #${status.asInBlock.toString()}`);
        callback(null, 'done');
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(':( transaction failed', error);
      callback(error);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    callback(e);
  }
};

const politiPool = async (payload, callback) => {
  const { values: { amount }, walletAddress } = payload;
  const api = await ApiPromise.create({ provider });
  const politiPoolExtrinsic = api.tx.llm.politicsLock(meritsToGrains(amount));

  const injector = await web3FromSource('polkadot-js');
  politiPoolExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status, events, dispatchError }) => {
    console.log('dispatchError')
    console.log(dispatchError?.toString())

    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, status.asInBlock.toString());
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
    callback(error);
  });
};

const getUserRoleRpc = async (walletAddress) => {
  try {
    const api = await ApiPromise.create({ provider });
    const identityResult = await api.query.identity.identityOf(walletAddress);
    const userRoleObject = identityResult?.toHuman()?.info.additional[0];
    if (userRoleObject && (USER_ROLES.includes(userRoleObject[0]?.Raw) && userRoleObject[1]?.Raw === '1')) {
      return userRolesHelper.assignJsIdentity(userRoleObject[0].Raw);
    }
    return { non_citizen: 'non_citizen' };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null;
};

const getCurrentBlockNumberRpc = async () => {
  try {
    const api = await ApiPromise.create({ provider });
    const bestNumber = await api.derive.chain.bestNumber();
    return (bestNumber.toNumber());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null;
};

const getAllWalletsRpc = async () => web3Accounts();

const getResultByHashRpc = async (blockHash) => {
  const api = await ApiPromise.create({ provider });
  const signedBlock = await api.rpc.chain.getBlock(blockHash);
  const allRecords = await api.query.system.events.at(signedBlock.block.header.hash);
  let result = '';
  const error = {
    error: false,
    details: '',
  };

  // map between the extrinsics and events
  signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
    allRecords
      // filter the specific events based on the phase and then the
      // index of our extrinsic in the block
      .filter(({ phase }) => phase.isApplyExtrinsic
        && phase.asApplyExtrinsic.eq(index))
      // test the events against the specific types we are looking for
      // eslint-disable-next-line consistent-return
      .forEach(({ event }) => {
        if (api.events.system.ExtrinsicSuccess.is(event)) {
          // extract the data for this event
          // (In TS, because of the guard above, these will be typed)
          const [dispatchInfo] = event.data;

          // eslint-disable-next-line no-console
          console.log(`${section}.${method}:: ExtrinsicSuccess:: ${dispatchInfo.toString()}`);
          result = 'success';
        } else if (api.events.system.ExtrinsicFailed.is(event)) {
          // extract the data for this event
          const [dispatchError] = event.data;
          let errorInfo;

          // decode the error
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            // (For specific known errors, we can also do a check against the
            // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            // eslint-disable-next-line no-console
            console.log('decoded  ', decoded);

            errorInfo = `${decoded.docs}`;
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            errorInfo = dispatchError.toString();
          }
          error.details = errorInfo;
          // eslint-disable-next-line no-console
          console.log(`${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`);
          result = 'failure';
        }
      });
  });
  return { result, error };
};

const getValidators = async () => {
  const api = await ApiPromise.create({ provider });
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
  const api = await ApiPromise.create({ provider });
  const nominations = await api.query.staking.nominators(walletId);

  return nominations?.toHuman()?.targets ? nominations?.toHuman()?.targets : [];
};

const setNewNominatorTargets = async (newNominatorTargets, walletAddress) => {
  const injector = await web3FromAddress(walletAddress);
  const api = await ApiPromise.create({ provider });
  const setNewTargets = await api.tx.staking.nominate(newNominatorTargets);
  await setNewTargets.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`InBlock at block hash #${status.asInBlock.toString()}`);
      callback(null, 'done');
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
    callback(error);
  });
};

const getDemocracyReferendums = async (address) => {
  try {
    const ssoAccessTokenHash = sessionStorage.getItem('ssoAccessTokenHash');
    const api = await ApiPromise.create({ provider });
    const proposals = await api.query.democracy.publicProps();
    const referendumInfoOf = await api.query.democracy.referendumInfoOf(['0x767a116c005fc82e2604b07e70872c4e25ccd1d57a62c5cdabdf0d4e7ab76e29']);
    const apideriveReferendums = await api.derive.democracy.referendums();
    const apideriveReferendumsActive = await api.derive.democracy.referendumsActive();
    const dispatch = await api.derive.democracy.dispatchQueue();
    const userVotes = await api.query.democracy.votingOf(address);
    const proposalsDerive = await api.derive.democracy.proposals();
    const proposalData = [];
    proposals.toHuman().forEach((proposalItem) => {
      proposalData.push({
        index: proposalItem[0],
        preimageHash: proposalItem[1],
        proposer: proposalItem[2],
      });
    });

    // TODO REFACTOR
    let centralizedReferendumsData = [];
    const api2 = axios.create({
      baseURL: process.env.REACT_APP_API2,
      withCredentials: true,
    });
    api2.defaults.headers.common['x-auth-token'] = ssoAccessTokenHash;

    await api2.get('/referenda').then((result) => {
      centralizedReferendumsData = result.data;
    });

    const crossReferencedReferendumsData = [];
    apideriveReferendums.forEach((referendum) => {
      console.log('human index');
      console.log(referendum.index.toHuman());
      const referendumIndex = referendum.index.toHuman();
      let centralizedBackendItem = {};
      centralizedReferendumsData.forEach((centralizedData) => {
        if (parseInt(centralizedData.chainIndex) === parseInt(referendumIndex)) {
          centralizedBackendItem = centralizedData;
        }
      });
      referendum.centralizedData = centralizedBackendItem;
      crossReferencedReferendumsData.push(referendum);
    });

    const crossReferencedProposalsData = [];
    proposalsDerive.forEach((proposal) => {
      const proposalIndex = proposal.index;
      let centralizedBackendItem = {};
      centralizedReferendumsData.forEach((centralizedData) => {
        if (parseInt(centralizedData.chainIndex) === parseInt(proposalIndex)) {
          centralizedBackendItem = centralizedData;
        }
      });
      proposal.centralizedData = centralizedBackendItem;
      crossReferencedProposalsData.push(proposal);
    });

    // const referendums = api.query.democracy.publicProps();
    return {
      proposalData,
      apideriveReferendums,
      crossReferencedReferendumsData,
      crossReferencedProposalsData,
      apideriveReferendumsActive,
      userVotes: userVotes.toHuman(),
      proposalsDerive,
      centralizedReferendumsData,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

const secondProposal = async (walletAddress, proposal) => {
  const api = await ApiPromise.create({ provider });
  const injector = await web3FromAddress(walletAddress);
  const secondExtrinsic = api.tx.democracy.second(proposal, 2000);
  secondExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
  });
};

const voteOnReferendum = async (walletAddress, referendumIndex, voteType) => {
  const api = await ApiPromise.create({ provider });
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

  voteExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VOTE at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction VOTE failed', error);
  });
};

const getProposalHash = async (values, legislationIndex) => {
  console.log('GETTING PROPOSAL HASH');
  const api = await ApiPromise.create({ provider });
  const extrinsicEncoded = api.tx.liberlandLegislation.addLaw(
    parseInt(values.legislationTier), legislationIndex, values.legislationContent,
  ).method.toHex();
  const hash = { encodedHash: blake2AsHex(extrinsicEncoded), extrinsicEncoded };
  return hash;
};

const submitProposal = async (walletAddress, values) => {
  const api = await ApiPromise.create({ provider });
  const injector = await web3FromAddress(walletAddress);
  const nextChainIndexQuery = await api.query.democracy.referendumCount();
  const nextChainIndex = nextChainIndexQuery.toHuman();
  const ssoAccessTokenHash = sessionStorage.getItem('ssoAccessTokenHash');
  // TODO REFACTOR
  const api2 = axios.create({
    baseURL: process.env.REACT_APP_API2,
    withCredentials: true,
  });
  api2.defaults.headers.common['X-Token'] = ssoAccessTokenHash;

  const centralizedMetadata = await api2.post('/referenda', {
    // username: 'username',
    link: values.forumLink,
    // personId: 10,
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
  const proposeTx = api.tx.democracy.propose({'Legacy': hash.encodedHash}, minDeposit);
  notePreimageTx.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed NOTEPREIMAGE at block hash #${status.asInBlock.toString()}`);
      proposeTx.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          // eslint-disable-next-line no-console
          console.log(`Completed PROPOSE at block hash #${status.asInBlock.toString()}`);
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(':( transaction PROPOSE failed', error);
      });
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction NOTEPREIMAGE failed', error);
  });
};

const getCongressMembersWithIdentity = async (walletAddress) => {
  const api = await ApiPromise.create({ provider });
  let councilMembers = await api.query.council.members();
  councilMembers = councilMembers.toHuman();
  const councilMembersIdentityQueries = [];
  councilMembers.forEach((councilMember) => {
    councilMembersIdentityQueries.push([api.query.identity.identityOf, councilMember]);
  });

  const councilMemberIdentities = await api.queryMulti([
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

  let candidates = await api.query.elections.candidates();
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

  const currentCandidateVotesByUserQuery = await api.query.elections.voting(walletAddress);
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
    console.log('rawIdentity');
    console.log(rawIdentity);
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

const voteForCongress = async (listofVotes, walletAddress) => {
  console.log('voting for congress');
  console.log(listofVotes);
  const api = await ApiPromise.create({ provider });
  const injector = await web3FromAddress(walletAddress);
  const votes = listofVotes.map((vote) => vote.rawIdentity);
  console.log('votes');
  console.log(votes);

  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();

  const voteExtrinsic = api.tx.elections.vote(votes, LLMPolitiPoolData);

  voteExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VOTE at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction VOTE failed', error);
  });
};

const getLegislation = async (tier) => {
  try {
    const api = await ApiPromise.create({ provider });

    const legislationRaw = await api.query.liberlandLegislation.laws.entries(tier);
    const legislationHuman = legislationRaw.map((x) => ({
      key: x[0].toHuman(), value: x[1].toHuman()
    }));

    const legislation = legislationHuman.map(({ key, value }) => ({
      tier: key[0],
      index: key[1],
      content: value,
    }));
    return legislation;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

export {
  getBalanceByAddress,
  sendTransfer,
  sendTransferLLM,
  stakeToPolkaBondAndExtra,
  politiPool,
  getUserRoleRpc,
  getCurrentBlockNumberRpc,
  getAllWalletsRpc,
  getResultByHashRpc,
  getValidators,
  getNominatorTargets,
  setNewNominatorTargets,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
  submitProposal,
  getCongressMembersWithIdentity,
  voteForCongress,
  getLegislation,
};
