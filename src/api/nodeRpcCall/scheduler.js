import { u8aToHex } from '@polkadot/util';
import pako from 'pako';
import { getApi, submitExtrinsic } from './core';

const fetchPreimageLen = async (hash) => {
  const api = await getApi();
  const keys = await api.query.preimage.preimageFor.keys();
  const key = keys.find((keyElement) => keyElement.args[0][0].eq(hash));
  return key?.args[0][1];
};

const fetchPreimage = async (hash, len) => {
  const api = await getApi();
  const length = len || await fetchPreimageLen(hash);
  return api.query.preimage.preimageFor([hash, length]);
};

const decodeCall = async (bytes) => {
  const api = await getApi();
  return api.createType('Call', bytes);
};

const getPreImage = async (preimageId, len) => {
  const api = await getApi();
  const preimageRaw = await api.query.preimage.preimageFor([preimageId, len]);
  const preimage = preimageRaw.isSome ? await api.createType('Call', preimageRaw.unwrap()) : null;
  return preimage;
};

const getSectionType = (origin) => {
  if (origin?.isSystem && origin.asSystem.isSigned) {
    return 'congress';
  }
  if ((origin?.isSystem && origin.asSystem.isRoot) || (origin?.isDemocracy && origin.asDemocracy.isReferendum)) {
    return 'democracy';
  }
  return null;
};

const getScheduledCalls = async () => {
  const api = await getApi();
  const agendaEntries = await api.query.scheduler.agenda.entries();
  const agendaItems = agendaEntries
    .flatMap(([key, calls]) => calls
      .map((call, idx) => ({
        blockNumber: key.args[0],
        idx,
        call,
      }))
      .filter((item) => item.call.isSome)
      .map((item) => {
        const call = item.call.unwrap();
        const sectionType = getSectionType(call.origin);

        return {
          ...item,
          call,
          sectionType,
        };
      }));

  const lookupItems = agendaItems.filter((item) => item.call.call.isLookup
      && item.call.maybePeriodic.isNone);
  // we're interested only in referendum results, so nonperiodic
  // we only want do download small preimages. fetching multi-megabyte setCode could be painful.
  const bigAgendaItems = lookupItems.filter((item) => item.call.call.asLookup.len > 10240);
  const smallAgendaItems = lookupItems.filter((item) => item.call.call.asLookup.len <= 10240);

  const preimageIds = smallAgendaItems.map((item) => ([item.call.call.asLookup.hash_, item.call.call.asLookup.len]));
  const preimagesRaw = await api.query.preimage.preimageFor.multi(preimageIds);
  const preimages = preimagesRaw.map((raw) => (raw.isSome ? api.createType('Call', raw.unwrap()) : null));

  const lookupItemsData = [
    ...bigAgendaItems.map((item) => ({
      ...item,
      preimage: null,
      needCallPreImage: true,
    })),
    ...smallAgendaItems.map((item, idx) => ({
      ...item,
      preimage: preimages[idx],
    })),
  ];

  const inlineItems = agendaItems
    .filter((item) => item.call.call.isInline && item.call.maybePeriodic.isNone)
    .map((item) => {
      const { call } = item;
      return {
        ...item,
        proposal: api.createType('Call', call.call.asInline),
      };
    });
  return [...lookupItemsData, ...inlineItems];
};

const requestUnregisterCompanyRegistration = async (companyId, walletAddress) => {
  const api = await getApi();

  const extrinsic = api.tx.companyRegistry.requestEntityUnregister(0, companyId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const unregisterCompany = async (companyId, isSoft, walletAddress) => {
  const api = await getApi();

  const extrinsic = api.tx.companyRegistryOffice.execute(
    api.tx.companyRegistry.unregister(0, companyId, isSoft),
  );

  return submitExtrinsic(extrinsic, walletAddress, api);
};

const cancelCompanyRequest = async (companyId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.companyRegistry.cancelRequest(0, companyId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const setRegisteredCompanyData = async (companyId, companyData, walletAddress) => {
  const api = await getApi();
  const data = api.createType('CompanyData', companyData);
  const compressed = pako.deflate(data.toU8a());
  const setRegisteredEntity = api.tx.companyRegistry.setRegisteredEntity(0, companyId, u8aToHex(compressed));
  const extrinsic = api.tx.companyRegistryOffice.execute(setRegisteredEntity);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const fetchPendingIdentities = async () => {
  const api = await getApi();
  const raw = await api.query.identity.identityOf.entries();
  const processed = raw.map((rawEntry) => ({
    address: rawEntry[0].toHuman()[0],
    data: rawEntry[1].toJSON(),
  }));
  return processed.filter((entity) => entity.data.judgements.length === 0);
};

export {
  fetchPreimage,
  decodeCall,
  getPreImage,
  getScheduledCalls,
  requestUnregisterCompanyRegistration,
  unregisterCompany,
  cancelCompanyRequest,
  setRegisteredCompanyData,
  fetchPendingIdentities,
};
