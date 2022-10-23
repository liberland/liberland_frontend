import { web3Accounts, web3FromAddress, web3FromSource } from '@polkadot/extension-dapp';
import { BN, BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import axios from 'axios';
import prettyNumber from '../utils/prettyNumber';
import matchPowHelper from '../utils/matchPowHelper';
import roughScale from '../utils/roughScale';

import citizenAddressList from '../constants/citizenAdressList';
import { USER_ROLES, userRolesHelper } from '../utils/userRolesHelper';
import user from '../redux/reducers/user';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
    const api = await ApiPromise.create({ provider });
    // TODO get this in one transaction?
    const LLDData = await api.query.system.account(address);
    const LLMData = await api.query.llm.llmBalance(address);
    const LLDWalletData = LLDData.toJSON();
    const LLDTotalAmount = parseInt(LLDWalletData.data.miscFrozen) + parseInt(LLDWalletData.data.free);
    const LLMWalletData = LLMData.toJSON();
    console.log('LLMWalletData');
    console.log(LLMWalletData);
    return {
      liberstake: {
        amount: 0,
      },
      polkastake: {
        amount: LLDWalletData.data.miscFrozen,
      },
      liquidMerits: {
        amount: LLMWalletData,
      },
      totalAmount: {
        amount: LLDTotalAmount,
      },
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
}
/* try {
    const api = await ApiPromise.create({ provider });
    const {
      data: { free: previousFree },
    } = await api.query.system.account(address);
    const api2 = await ApiPromise.create({
      provider,
      types: {
        StakingLedger: {
          stash: 'AccountId',
          total: 'Compact<Balance>',
          active: 'Compact<Balance>',
          unlocking: 'Vec<UnlockChunk>',
          claimedRewards: 'Vec<EraIndex>',
          polkaAmount: 'Compact<Balance>',
          liberAmount: 'Compact<Balance>',
        },
      },
    });
    const ledger = await api2.query.stakingPallet.ledger(address);
    let polkaAmount = 0;
    let liberAmount = 0;
    let totalAmount = 0;
    if (ledger.toString() !== '') {
      const ledgerObj = JSON.parse(ledger.toString());
      polkaAmount = ledgerObj.polkaAmount;
      liberAmount = ledgerObj.liberAmount;
      totalAmount = ledgerObj.total;
    }
    return ({
      liberstake: {
        amount: liberAmount,
      },
      polkastake: {
        amount: polkaAmount,
      },
      liquidMerits: {
        amount: parseInt(previousFree.toString(), 10) - totalAmount,
      },
      totalAmount: {
        amount: parseInt(previousFree.toString(), 10),
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  } */
;

const sendTransfer = async (payload, callback) => {
  const { account_to, amount, account_from } = payload;
  const api = await ApiPromise.create({ provider });

  const transferExtrinsic = api.tx.balances.transfer(account_to, (amount));
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
      : await api.tx.staking.bond(walletAddress, `${amount}000000000000`, walletAddress);

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

const stakeToLiberlandBondAndExtra = async (payload, callback) => {
  try {
    const { values: { amount }, isUserHaveStake, walletAddress } = payload;
    const api = await ApiPromise.create({ provider });

    const transferExtrinsic = isUserHaveStake
      ? await api.tx.stakingPallet.liberlandBondExtra(`${amount}000000000000`)
      : await api.tx.stakingPallet.liberlandBond(walletAddress, (`${amount}000000000000`), 'Staked');

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

const applyMyCandidacy = async (walletAddress, callback) => {
  const api = await ApiPromise.create({ provider });
  if (walletAddress) {
    const injector = await web3FromAddress(walletAddress);
    await api.tx.assemblyPallet
      .addCandidate()
      .signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
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
  }
};

const getCandidacyListRpc = async () => []
/* try {
    const api = await ApiPromise.create({
      provider,
      types: {
        Candidate: {
          pasportId: 'Vec<u8>',
        },
      },
    });
    const candidatesList = await api.query.assemblyPallet.candidatesList();
    // eslint-disable-next-line no-console
    // console.log('candidatesList', JSON.parse(candidatesList.toString()));
    return JSON.parse(candidatesList.toString());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null; */
;

const sendElectoralSheetRpc = async (args, callback) => {
  const electoralSheet = args[0];
  const walletAddress = args[1];
  const dataForNode = await electoralSheet.map((el) => ({ pasportId: el.id }));
  const api = await ApiPromise.create({
    provider,
    types: {
      Candidate: {
        pasportId: 'Vec<u8>',
      },
      AltVote: 'VecDeque<Candidate>',
    },
  });
  if (walletAddress) {
    const injector = await web3FromAddress(walletAddress);
    await api.tx.assemblyPallet
      .vote(dataForNode)
      .signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
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
  }
};

const setIsVotingInProgressRpc = async () => false
/* try {
    const api = await ApiPromise.create({ provider });
    const isVotingInProgress = await api.query.assemblyPallet.votingState();
    // eslint-disable-next-line no-console
    console.log('isVotingInProgress', isVotingInProgress.toString());
    return (isVotingInProgress.toString());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null; */
;

const getMinistersRpc = async () => []
/* try {
    const api = await ApiPromise.create({
      provider,
      types: {
        Candidate: {
          pasportId: 'Vec<u8>',
        },
        votingPower: 'u64',
        Minister: 'BTreeMap<Candidate>, <votingPower>',
      },
    });
    const assembliesList = JSON.parse(await api.query.assemblyPallet.currentAssembliesList());
    // eslint-disable-next-line no-console
    console.log('getAssembliesRpc', assembliesList);

    if (Object.keys(assembliesList).length === 0) return { finaleObject: [], liberStakeAmount: 0 };

    const liberStakeAmount = Object.values(assembliesList)
      .reduce((acum, curVal) => (acum + matchPowHelper(roughScale(curVal, 16))), 0);

    let finaleObject = [];
    let i = 1;
    for (const prop in assembliesList) {
      if (Object.prototype.hasOwnProperty.call(assembliesList, prop)) {
        finaleObject = [...finaleObject, {
          id: i,
          place: i,
          deputies: JSON.parse(prop).pasportId,
          supported: `${prettyNumber(assembliesList[prop])}`,
          // eslint-disable-next-line max-len
          power: liberStakeAmount !== 0
            ? ((matchPowHelper(assembliesList[prop]) * 100) / liberStakeAmount)
              .toFixed(2)
            : 100,
        }];
        i += 1;
      }
    }
    finaleObject.sort((a, b) => (a.power < b.power ? 1 : -1));
    return { finaleObject, liberStakeAmount };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return []; */
;

const sendLawProposal = async (args, callback) => {
  const data = args[0];
  const walletAddress = args[1];
  const { hash, proposalType } = data;

  const api = await ApiPromise.create({
    provider,
    types: {
      law_hash: 'Hash',
      LawType: {
        _enum: ['ConstitutionalChange', 'Legislation', 'Decision'],
      },
    },
  });

  if (walletAddress) {
    const injector = await web3FromAddress(walletAddress);
    await api.tx.assemblyPallet
      .proposeLaw(hash, proposalType)
      .signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
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
  }
};

const getProposalHashesRpc = async (hashesNotDraft, callback) =>
  /* try {
    const api = await ApiPromise.create({
      provider,
      types: {
        law_hash: 'Hash',
        LawState: {
          _enum: ['Approved', 'InProgress', 'Declined'],
        },
        LawType: {
          _enum: ['ConstitutionalChange', 'Legislation', 'Decision'],
        },
        Law: {
          state: 'LawState',
          law_type: 'LawType',
        },
      },
    });
    const newStatuses = await hashesNotDraft.map(async (el) => {
      const state = await api.query.assemblyPallet.laws(el.docHash)
        .then((value) => value.toString().split(',')[0].split('":"')[1].split('"')[0]);
      return ({
        docHash: el.docHash,
        state,
      });
    });
    Promise.all(newStatuses).then((value) => callback(null, value)).catch((e) => callback(e));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
    callback(e);
  } */
  null;
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

const voteByProposalRpc = async (args, callback) => {
  const data = args[0];
  const walletAddress = args[1];
  const { docHash, decision } = data;
  const injector = await web3FromAddress(walletAddress);
  const api = await ApiPromise.create({
    provider,
    types: {
      law_hash: 'Sha256',
      Decision: {
        _enum: ['Accept', 'Decline'],
      },
    },
  });
  await api.tx.assemblyPallet
    .voteToLaw(docHash, decision)
    .signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
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

const getCurrentPowerProposalRpc = async (docHash, callback) => {
  const api = await ApiPromise.create({
    provider,
    types: {
      law_hash: 'Sha256',
      VotingSettings: {
        result: 'u64',
        voting_duration: 'BlockNumber',
        submitted_height: 'BlockNumber',
      },
    },
  });

  let power = await api.query.votingPallet.activeVotings(docHash);
  power = (JSON.parse(power).result === 0) ? 0 : matchPowHelper(JSON.parse(power).result * 1);
  callback(null, power);
};

const getUserPassportId = async (walletAddress) =>
// TODO remove passports logic as its not required on new chain
  /* const api = await ApiPromise.create({
    provider,
    types: {
      PassportId: '[u8; 32]',
    },
  });
  return api.query.identityPallet.passportIds(walletAddress); */
  12345;
const getAllWalletsRpc = async () => web3Accounts();

const getResultByHashRpc = async (blockHash) => {
  const api = await ApiPromise.create({ provider });
  const signedBlock = await api.rpc.chain.getBlock(blockHash);
  const allRecords = await api.query.system.events.at(signedBlock.block.header.hash);
  let result = '';

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

            errorInfo = `${decoded.documentation}`;
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            errorInfo = dispatchError.toString();
          }
          // eslint-disable-next-line no-console
          console.log(`${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`);
          result = 'failure';
        }
      });
  });
  return result;
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
    console.log('called with address');
    console.log(address);
    const api = await ApiPromise.create({ provider });
    const proposals = await api.query.democracy.publicProps();
    const referendumInfoOf = await api.query.democracy.referendumInfoOf(['0x767a116c005fc82e2604b07e70872c4e25ccd1d57a62c5cdabdf0d4e7ab76e29']);
    const apideriveReferendums = await api.derive.democracy.referendums();
    const apideriveReferendumsActive = await api.derive.democracy.referendumsActive();
    const dispatch = await api.derive.democracy.dispatchQueue();
    const userVotes = await api.query.democracy.votingOf(address);
    const proposalsDerive = await api.derive.democracy.proposals();
    console.log('proposalsDerive');
    console.log(proposalsDerive);
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
      baseURL: 'http://localhost:8010',
      withCredentials: true,
    });
    api2.defaults.headers.common['x-auth-token'] = '7VpLfCKnCdc5BDyzECsr57EFCHOJPaXziGNKbBAvxgFcc0wfB3fIE1LEXOARxkWJ';

    await api2.get('/referendums').then((result) => {
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
  // TODO BALANCE ALWAYS VOTE MAX when chain ready
  const voteExtrinsic = api.tx.democracy.vote(referendumIndex, {
    Standard: {
      vote: {
        aye: voteType === 'Aye',
        conviction: 1,
      },
      balance: 1000000000000000,
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
  // const extrinsicEncoded = api.tx.system.remark(values.legislationTier + values.legislationName + values.forumLink, values.legislationContent).method.toHex();
  const extrinsicEncoded = api.tx.liberlandLegislation.addLaw(
    parseInt(values.legislationTier), legislationIndex, values.legislationContent,
  ).method.toHex();
  const storageFee = api.consts.democracy.preimageByteDeposit.mul(new BN((extrinsicEncoded.length - 2) / 2));
  const hash = { encodedHash: blake2AsHex(extrinsicEncoded), extrinsicEncoded, storageFee };
  return hash;
};

const submitProposal = async (walletAddress, values) => {
  const api = await ApiPromise.create({ provider });
  const injector = await web3FromAddress(walletAddress);
  const nextChainIndexQuery = await api.query.democracy.referendumCount();
  const nextChainIndex = nextChainIndexQuery.toHuman();
  // TODO REFACTOR
  const api2 = axios.create({
    baseURL: 'http://localhost:8010',
    withCredentials: true,
  });
  api2.defaults.headers.common['X-Token'] = '7VpLfCKnCdc5BDyzECsr57EFCHOJPaXziGNKbBAvxgFcc0wfB3fIE1LEXOARxkWJ';

  const centralizedMetadata = await api2.post('/referendums', {
    username: 'username',
    link: values.forumLink,
    personId: 10,
    chainIndex: nextChainIndex,
    description: values.legislationContent,
    hash: 'hash not needed',
    additionalMetadata: {},
  });
  const legislationIndex = centralizedMetadata.data.id;
  const hash = await getProposalHash(values, legislationIndex);
  const notePreimageTx = api.tx.democracy.notePreimage(hash.extrinsicEncoded);
  const proposeTx = api.tx.democracy.propose(hash.encodedHash, hash.storageFee);
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
    rawIdentity = typeof rawIdentity === "string" ? rawIdentity : rawIdentity[0]
    crossReferencedCouncilMemberIdentities.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity: rawIdentity,
    });
  });

  let candidates = await api.query.elections.candidates();
  candidates = candidates.toHuman();
  // TODO isolate in function ?
  const candidatesIdentityQueries = [];
  candidates.forEach((candidate) => {
    candidatesIdentityQueries.push([api.query.identity.identityOf, candidate[0]]);
  });

  const candidateIdentities = await api.queryMulti([
    ...candidatesIdentityQueries,
  ]);

  const crossReferencedCandidateIdentities = [];
  candidateIdentities.forEach((candidateIdentity) => {
    const toHumanIdentity = candidateIdentity.toHuman();
    // address use councilmembers.shift as its same ordering as councilmemberidentities
    let rawIdentity = candidates.shift();
    rawIdentity = typeof rawIdentity === "string" ? rawIdentity : rawIdentity[0]
    crossReferencedCandidateIdentities.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity: rawIdentity,
    });
  });

  const currentCandidateVotesByUserQuery = await api.query.elections.voting(walletAddress);
  const currentCandidateVotesByUser = currentCandidateVotesByUserQuery.toHuman().votes;

  const currentCandidateVotesByUserIdentityQueries = [];
  currentCandidateVotesByUser.forEach((currentCandidateVote) => {
    currentCandidateVotesByUserIdentityQueries.push([api.query.identity.identityOf, currentCandidateVote]);
  });

  const currentCandidateVotesByUserIdentities = await api.queryMulti(
    [
      ...currentCandidateVotesByUserIdentityQueries,
    ],
  );

  const crossReferencedCurrentCandidateVotesByUser = [];
  currentCandidateVotesByUserIdentities.forEach(currentCandidateVoteIdentity => {
    const toHumanIdentity = currentCandidateVoteIdentity.toHuman();
    // address use councilmembers.shift as its same ordering as councilmemberidentities
    let rawIdentity = currentCandidateVotesByUser.shift();
    rawIdentity = typeof rawIdentity === "string" ? rawIdentity : rawIdentity[0]
    console.log('rawIdentity')
    console.log(rawIdentity)
    crossReferencedCurrentCandidateVotesByUser.push({
      name: toHumanIdentity?.info?.display?.Raw ? toHumanIdentity.info.display.Raw : rawIdentity,
      identityData: toHumanIdentity,
      rawIdentity: rawIdentity,
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
  console.log('voting for cuntgress')
  console.log(listofVotes)
  const api = await ApiPromise.create({ provider });
  const injector = await web3FromAddress(walletAddress);
  let votes = listofVotes.map(vote => {return vote.rawIdentity})
  console.log('votes')
  console.log(votes)

  const voteExtrinsic = api.tx.elections.vote(votes, 100000000);

  voteExtrinsic.signAndSend(walletAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed VOTE at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction VOTE failed', error);
  });
}

export {
  getBalanceByAddress,
  sendTransfer,
  stakeToPolkaBondAndExtra,
  stakeToLiberlandBondAndExtra,
  applyMyCandidacy,
  getCandidacyListRpc,
  sendElectoralSheetRpc,
  setIsVotingInProgressRpc,
  getMinistersRpc,
  getUserRoleRpc,
  sendLawProposal,
  getCurrentBlockNumberRpc,
  getProposalHashesRpc,
  voteByProposalRpc,
  getCurrentPowerProposalRpc,
  getUserPassportId,
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
  voteForCongress
};
