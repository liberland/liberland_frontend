import { decodeAndFilter } from '../../utils/identityParser';
import { getApi, submitExtrinsic } from './core';

const batchPayoutStakers = async (targets, walletAddress) => {
  const api = await getApi();
  const calls = targets.map(({ validator, era }) => api.tx.staking.payoutStakers(validator, era));
  const extrinsic = api.tx.utility.batch(calls);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getStakersRewards = async (accounts) => {
  const api = await getApi();

  const allRewards = await api.derive.staking.stakerRewardsMulti(accounts, false);

  // allRewards may include rewards from validators that no longer have a stash.
  // Such rewards are unclaimable and essentially lost either way, so let's just
  // filter them out.

  // First find all validators that our stakers got rewards from
  const uniqValidatorsSet = new Set(allRewards.flatten().map(({ validators }) => Object.keys(validators)).flatten());
  const uniqValidators = Array.from(uniqValidatorsSet);

  // Validators are stashes, convert to controllers
  const controllers = await api.query.staking.bonded.multi(uniqValidators);
  const controllersWithIdx = controllers.map((v, i) => [i, v]);

  // If there's no controller attached, it's not a stash
  const noStashValidators = controllersWithIdx.filter(([, v]) => v.isNone).map(([i]) => uniqValidators[i]);

  // Fetch ledgers for validators with controller
  const stashValidators = controllersWithIdx.filter(([, v]) => v.isSome).map(([i, v]) => [i, v.unwrap()]);
  const ledgers = await api.query.staking.ledger.multi(stashValidators.map(([, v]) => v));

  // If there's no ledger, it's not a stash anymore
  const noControllerValidators = ledgers.reduce((broken, v, i) => {
    if (v.isNone) {
      return [...broken, uniqValidators[stashValidators[i][0]]];
    }
    return broken;
  }, []);

  const brokenValidators = [...noStashValidators, ...noControllerValidators];

  // filter out rewards from brokenValidators
  const validRewards = allRewards.map((accountRewards) => accountRewards.map((eraRewards) => {
    const goodValidators = Object.keys(eraRewards.validators)
      .filter((v) => !brokenValidators.includes(v))
      .reduce((obj, v) => ({ ...obj, [v]: eraRewards.validators[v] }), {});
    return {
      ...eraRewards,
      validators: goodValidators,
    };
  }).filter((eraRewards) => Object.keys(eraRewards.validators).length > 0));
  return validRewards;
};

const getSessionValidators = async () => {
  const api = await getApi();
  const rawData = await api.query.session.validators();
  return rawData.map((v) => v.toString());
};

const getNextSessionValidators = async () => {
  const api = await getApi();
  const data = await api.query.session.queuedKeys();
  return data.map(([validator]) => validator.toString());
};

const getStakingValidators = async () => {
  const api = await getApi();
  const rawData = await api.query.staking.validators.keys();
  return rawData.map((v) => v.args[0].toString());
};

const getNominators = async () => {
  const api = await getApi();
  return api.query.staking.nominators.entries();
};

const getStakingLedger = async (controller) => {
  const api = await getApi();
  return api.query.staking.ledger(controller);
};

const getAppliedSlashes = async () => {
  const api = await getApi();

  return {
    validator: await api.query.staking.validatorSlashInEra.entries(),
    nominator: await api.query.staking.nominatorSlashInEra.entries(),
  };
};

const getUnappliedSlashes = async () => {
  const api = await getApi();
  return api.query.staking.unappliedSlashes.entries();
};

const setSessionKeys = async (keys, walletAddress) => {
  const api = await getApi();
  const EMPTY_PROOF = new Uint8Array();
  const extrinsic = api.tx.session.setKeys(keys, EMPTY_PROOF);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getStakingPayee = async (stash) => {
  const api = await getApi();

  return api.query.staking.payee(stash);
};

const setStakingPayee = async (destination, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.staking.setPayee(destination);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getIdentities = async (addresses) => {
  const api = await getApi();
  const raw = await api.query.identity.identityOf.multi(addresses);
  return raw.map((identity, idx) => ({
    address: addresses[idx],
    identity: identity.isSome ? identity.unwrap().info : null,
  }));
};

const getIdentitiesNames = async (addresses) => {
  const api = await getApi();
  const raw = await api.query.identity.identityOf.multi(addresses);
  const identities = {};
  raw.map((identity, idx) => {
    identities[addresses[idx]] = {};
    const unwrapIdentity = identity.isSome ? identity.unwrap().info : null;

    let nameData;
    let legalData;

    if (unwrapIdentity) {
      const decodedData = decodeAndFilter(unwrapIdentity, ['display', 'legal']);
      nameData = decodedData?.display;
      legalData = decodedData?.legal;
    }
    identities[addresses[idx]].identity = { name: nameData, legal: legalData };

    return null;
  });
  return identities;
};

const stakingChill = async (walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.staking.chill();
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const stakingValidate = async (commission, blocked, keys, walletAddress) => {
  const api = await getApi();
  const EMPTY_PROOF = new Uint8Array();
  const setKeys = api.tx.session.setKeys(keys, EMPTY_PROOF);
  const validate = api.tx.staking.validate({ commission, blocked });
  const extrinsic = api.tx.utility.batchAll([setKeys, validate]);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const updateValidate = async (commission, blocked, walletAddress) => {
  const api = await getApi();
  const validate = api.tx.staking.validate({ commission, blocked });
  return submitExtrinsic(validate, walletAddress, api);
};

const bondAndValidate = async (bondValue, payee, commission, blocked, keys, walletAddress) => {
  const api = await getApi();
  const bond = api.tx.staking.bond(bondValue, payee);
  const EMPTY_PROOF = new Uint8Array();
  const setKeys = api.tx.session.setKeys(keys, EMPTY_PROOF);
  const validate = api.tx.staking.validate({ commission, blocked });
  const extrinsic = api.tx.utility.batchAll([bond, setKeys, validate]);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const stakingBond = async (value, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.staking.bond(value, 'Staked');
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const stakingBondExtra = async (value, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.staking.bondExtra(value);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const stakingUnbond = async (value, walletAddress) => {
  const api = await getApi();
  return submitExtrinsic(api.tx.staking.unbond(value), walletAddress, api);
};

const stakingWithdrawUnbonded = async (walletAddress) => {
  const api = await getApi();
  const ledger = await api.query.staking.ledger(walletAddress);
  if (ledger.isNone) throw new Error("Account isn't a stash controller!");

  const spans = await api.query.staking.slashingSpans(ledger.unwrap().stash);
  const spanCount = spans.isSome ? spans.unwrap().prior.length + 1 : 0;

  return submitExtrinsic(api.tx.staking.withdrawUnbonded(spanCount), walletAddress, api);
};

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
};

export {
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
  getIdentitiesNames,
  stakingChill,
  stakingValidate,
  updateValidate,
  bondAndValidate,
  stakingBond,
  stakingBondExtra,
  stakingUnbond,
  stakingWithdrawUnbonded,
  subscribeActiveEra,
  getStakingBondingDuration,
};
