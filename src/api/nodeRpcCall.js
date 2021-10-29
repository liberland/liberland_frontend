import { web3Accounts, web3FromAddress, web3FromSource } from '@polkadot/extension-dapp';
import prettyNumber from '../utils/prettyNumber';
import matchPowHelper from '../utils/matchPowHelper';
import roughScale from '../utils/roughScale';

import citizenAddressList from '../constants/citizenAdressList';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
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
  }
};

const sendTransfer = async (payload, callback) => {
  const { account_to, amount, account_from } = payload;
  const api = await ApiPromise.create({ provider });

  const transferExtrinsic = api.tx.balances.transfer(account_to, (amount * (10 ** 12)));
  const injector = await web3FromSource('polkadot-js');
  transferExtrinsic.signAndSend(account_from, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      callback(null, 'done');
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
      ? await api.tx.stakingPallet.bondExtra(`${amount}000000000000`)
      : await api.tx.stakingPallet.bond(walletAddress, `${amount}000000000000`);

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

const getCandidacyListRpc = async () => {
  try {
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
  return null;
};

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

const setIsVotingInProgressRpc = async () => {
  try {
    const api = await ApiPromise.create({ provider });
    const isVotingInProgress = await api.query.assemblyPallet.votingState();
    // eslint-disable-next-line no-console
    console.log('isVotingInProgress', isVotingInProgress.toString());
    return (isVotingInProgress.toString());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null;
};

const getMinistersRpc = async () => {
  try {
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
  return [];
};

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

const getProposalHashesRpc = async (hashesNotDraft, callback) => {
  try {
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
  }
  return null;
};

const getUserRoleRpc = async (walletAddress) => {
  try {
    if (!citizenAddressList.includes(walletAddress)) return { non_citizen: 'non_citizen' };

    const api = await ApiPromise.create({
      provider,
      types: {
        Candidate: {
          pasportId: 'Vec<u8>',
        },
      },
    });
    const api2 = await ApiPromise.create({
      provider,
      types: {
        PassportId: '[u8; 32]',
      },
    });
    const assembliesList = JSON.stringify(await api.query.assemblyPallet.currentAssembliesList());
    const passportId = await api2.query.identityPallet.passportIds(walletAddress);

    if (assembliesList.includes(passportId.toString())) {
      return {
        assemblyMember: 'assemblyMember',
        citizen: 'citizen',
      };
    }
    return { citizen: 'citizen' };
  } catch (e) {
  // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null;
};

const getPeriodAndVotingDurationRpc = async () => {
  try {
    const api = await ApiPromise.create({ provider });
    const assemblyElectionPeriod = api.consts.assemblyPallet.assemblyElectionPeriod.toNumber();
    // eslint-disable-next-line no-console
    console.log('AssemblyElectionPeriod', assemblyElectionPeriod);

    const assemblyVotingDuration = api.consts.assemblyPallet.assemblyVotingDuration.toNumber();
    // eslint-disable-next-line no-console
    console.log('assemblyVotingDuration', assemblyVotingDuration);

    return { assemblyVotingDuration, assemblyElectionPeriod };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
  }
  return null;
};

const getStatusProposalRpc = async (hash, callback) => {
  try {
    const api = await ApiPromise.create({
      provider,
      types: {
        lawHash: 'Hash',
        LawState: {
          _enum: ['Approved', 'InProgress', 'Declined'],
        },
        LawType: {
          _enum: ['ConstitutionalChange', 'Legislation', 'Decision'],
        },
        Law: {
          state: 'LawState',
          lawType: 'LawType',
        },
      },
    });
    const proposalStatus = await api.query.assemblyPallet.laws(hash);
    callback(null, JSON.parse(proposalStatus.toString()));
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

const getUserPassportId = async (walletAddress) => {
  const api = await ApiPromise.create({
    provider,
    types: {
      PassportId: '[u8; 32]',
    },
  });
  return api.query.identityPallet.passportIds(walletAddress);
};

const getAllWalletsRpc = async () => web3Accounts();

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
  getPeriodAndVotingDurationRpc,
  getStatusProposalRpc,
  getCurrentBlockNumberRpc,
  getProposalHashesRpc,
  voteByProposalRpc,
  getCurrentPowerProposalRpc,
  getUserPassportId,
  getAllWalletsRpc,
};
