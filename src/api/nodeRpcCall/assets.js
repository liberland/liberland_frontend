import { BN_ZERO } from '@polkadot/util';
import pako from 'pako';
import groupBy from 'lodash/groupBy';
import { IndexHelper } from '../../utils/council/councilEnum';
import { blockchainDataToFormObject } from '../../utils/nodeRpcCall';
import { parseDollars, parseMerits } from '../../utils/walletHelpers';
import identityJudgementEnums from '../../constants/identityJudgementEnums';
import { getApi, submitExtrinsic } from './core';

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
};

const createOrUpdateAsset = async ({
  id,
  name,
  symbol,
  decimals,
  minBalance,
  admin,
  issuer,
  freezer,
  owner,
  companyId,
  isCreate,
  isStock,
  defaultValues,
}) => {
  try {
    const api = await getApi();
    if (isCreate) {
      const create = await api.tx.assets.create(id, admin, minBalance);
      await submitExtrinsic(create, owner, api);
    }
    if (isStock && isCreate) {
      const params = await api.tx.assets.setParameters(id, { eresidencyRequired: true });
      await submitExtrinsic(params, owner, api);
    }
    if (defaultValues?.name !== name || defaultValues?.symbol !== symbol || defaultValues?.decimals !== decimals) {
      const setMetadata = await api.tx.assets.setMetadata(id, name, symbol, decimals);
      await submitExtrinsic(setMetadata, owner, api);
    }
    if (defaultValues?.issuer !== issuer || defaultValues?.admin !== admin || defaultValues?.freezer !== freezer) {
      const setTeam = await api.tx.assets.setTeam(id, issuer, admin, freezer);
      await submitExtrinsic(setTeam, owner, api);
    }
    if (defaultValues?.companyId !== companyId) {
      const setCompanyId = await api.tx.assets.setRelatedCompany(id, companyId);
      await submitExtrinsic(setCompanyId, owner, api);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const mintAsset = async ({
  id,
  beneficiary,
  amount,
  owner,
}) => {
  try {
    const api = await getApi();
    const mint = await api.tx.assets.mint(id, beneficiary, amount);
    await submitExtrinsic(mint, owner, api);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getLlmBalances = async (addresses) => {
  try {
    const api = await getApi();
    const balances = await api.query.assets.account.multi(addresses.map((a) => [1, a]));
    return addresses.reduce((acc, addr, idx) => {
      if (balances[idx].isSome) return Object.assign(acc, { [addr]: balances[idx].unwrap().balance });
      return Object.assign(acc, { [addr]: 0 });
    }, {});
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getLldBalances = async (addresses) => {
  try {
    const api = await getApi();
    const balances = await api.query.system.account.multi(addresses);
    return addresses.reduce((acc, addr, idx) => Object.assign(acc, { [addr]: balances[idx].data.free }), {});
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getAssetData = async (asset, address) => {
  try {
    const api = await getApi();
    const maybeData = await api.query.assets.account(asset, address);
    if (maybeData.isSome) {
      const data = maybeData.unwrapOrDefault();
      return data.balance;
    }
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getAssetDetails = async (ids) => {
  try {
    const api = await getApi();
    const details = (await api.query.assets.asset.multi(ids)).map((asset) => asset.toJSON());
    const assetQueries = details.reduce((queries, detail) => {
      queries.push([api.query.identity.identityOf, detail.admin]);
      queries.push([api.query.identity.identityOf, detail.freezer]);
      queries.push([api.query.identity.identityOf, detail.issuer]);
      queries.push([api.query.identity.identityOf, detail.owner]);
      return queries;
    }, []);
    const assetResults = await api.queryMulti(assetQueries);
    const resolvedIdentity = assetResults.map((result) => {
      const json = result.toJSON();
      const raw = json?.info?.display?.raw?.slice(2);
      if (!raw) {
        return '';
      }
      return Buffer.from(raw, 'hex').toString('utf-8');
    }).reduce((accumulator, item) => {
      const lastItem = accumulator[accumulator.length - 1];
      if (!lastItem) {
        accumulator.push([item]);
      } else if (lastItem.length < 4) {
        lastItem.push(item);
      } else {
        accumulator.push([item]);
      }
      return accumulator;
    }, []);

    const resolvedDetails = details.map((detail, index) => ({
      ...detail,
      supply: detail.supply.toString().startsWith('0x')
        ? window.BigInt(detail.supply).toString()
        : detail.supply,
      identity: {
        admin: resolvedIdentity[index][0] || detail.admin,
        freezer: resolvedIdentity[index][1] || detail.freezer,
        issuer: resolvedIdentity[index][2] || detail.issuer,
        owner: resolvedIdentity[index][3] || detail.owner,
      },
    }));

    return resolvedDetails;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const convertCompanyValue = (api, id, companyValue) => {
  let companyData;
  try {
    if (companyValue.isNone) companyData = { unregister: true };
    else {
      const compressed = companyValue?.isSome
        ? companyValue.unwrap().data : companyValue.data;
      companyData = api.createType('CompanyData', pako.inflate(compressed));
    }

    const formObject = blockchainDataToFormObject(companyData);

    const dataObject = { ...formObject, id };
    return dataObject;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return null;
  }
};

const getOfficialRegistryEntries = async () => {
  const api = await getApi();
  const allEntites = await api.query.companyRegistry.registries.entries(0);
  const registeredCompanies = [];
  allEntites.forEach((companyRegistry) => {
    const [key, companyValue] = companyRegistry;
    const entityId = key.toHuman();
    const companyData = convertCompanyValue(api, entityId[1], companyValue);
    if (companyData) {
      registeredCompanies.push(companyData);
    }
  });
  return registeredCompanies;
};

const getCompaniesByIds = async (ids) => {
  const api = await getApi();
  const queries = ids.map((id) => [api.query.companyRegistry.registries, [0, id]]);
  const resolved = await api.queryMulti(queries);
  return resolved.map((r, i) => convertCompanyValue(api, ids[i], r)).filter(Boolean);
};

const getAdditionalAssets = async (address, isIndexNeed = false, isLlmNeeded = false) => {
  try {
    const api = await getApi();
    const assetMetadatas = await api.query.assets.metadata.entries();
    const processedMetadatas = assetMetadatas.map((rawEntry) => ({
      // TODO FIXME figure out the proper types
      index: parseInt(rawEntry[0].toHuman()[0].replace(/,/g, '')),
      metadata: rawEntry[1].toHuman(),
    }));
    const assets = [];
    const assetQueries = [];
    const parametersQueries = [];
    const relatedCompanyQueries = [];
    processedMetadatas.forEach((asset) => {
      // Disregard LLM, asset of ID 1 because it has special treatment already
      const isNotLLM = isLlmNeeded || !(asset.index === 1 || asset.index === '1');
      if (isNotLLM) {
        relatedCompanyQueries.push([api.query.assets.relatedCompany, [asset.index]]);
        assetQueries.push([api.query.assets.account, [asset.index, address]]);
        parametersQueries.push([api.query.assets.parameters, [asset.index]]);
        assets.push(asset);
      }
    });

    if (relatedCompanyQueries.length !== 0) {
      const relatedCompanyResults = await api.queryMulti(relatedCompanyQueries);
      const companies = await getCompaniesByIds(relatedCompanyResults.map((r) => r.toJSON()));
      const mapped = groupBy(companies, 'id');
      relatedCompanyResults.forEach((relatedCompanyId, index) => {
        const company = mapped[relatedCompanyId.toJSON()]?.[0];
        if (company) {
          assets[index].company = company;
        }
      });
    }

    if (assetQueries.length !== 0) {
      const assetResults = await api.queryMulti(assetQueries);

      assetResults.forEach((assetResult, index) => {
        assets[index].balance = assetResult.toJSON() || '0';
      });
    }

    if (parametersQueries.length !== 0) {
      const parametersResults = await api.queryMulti(parametersQueries);
      parametersResults.forEach(({ eresidencyRequired }, index) => {
        assets[index].isStock = eresidencyRequired?.valueOf() || false;
      });
    }

    if (isIndexNeed) {
      return assets.reduce((acc, asset) => {
        acc[asset.index] = asset;
        return acc;
      }, {});
    }

    return assets;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const makeTransferExtrinsic = (api, trasferData) => {
  const { index, balance, recipient } = trasferData;
  let transferExtrinsic;
  if (index === IndexHelper.LLD) {
    transferExtrinsic = api.tx.balances.transfer(recipient, balance);
  } else if (index === IndexHelper.POLITIPOOL_LLM) {
    transferExtrinsic = api.tx.llm.sendLlmToPolitipool(recipient, balance);
  } else {
    transferExtrinsic = api.tx.assets.transfer(parseInt(index), recipient, balance);
  }
  return transferExtrinsic;
};

const makeRemarkExtrinsic = (api, remarkInfo) => api.tx.llm.remark(remarkInfo);

const transferWithRemark = async (remarkInfo, transfer, walletAddress) => {
  const api = await getApi();
  const remark = makeRemarkExtrinsic(api, remarkInfo);
  const transferExtrinsic = makeTransferExtrinsic(api, transfer);

  const call = [transferExtrinsic, remark];
  const extrinsic = api.tx.utility.batch(call);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const provideJudgementAndAssets = async ({
  address, hash, walletAddress, merits, dollars, judgementType = identityJudgementEnums.KNOWNGOOD,
}) => {
  const parsedMerits = parseMerits(merits);
  const parsedDollars = parseDollars(dollars);
  const api = await getApi();
  const calls = [];

  const judgement = api.createType('IdentityJudgement', judgementType);
  const judgementCall = api.tx.identity.provideJudgement(0, address, judgement, hash);
  const officeJudgementCall = api.tx.identityOffice.execute(judgementCall);
  calls.push(officeJudgementCall);

  if (parsedDollars?.gt(BN_ZERO)) {
    const lldCall = api.tx.balances.transfer(address, parsedDollars.toString());
    const officeLldCall = api.tx.identityOffice.execute(lldCall);
    calls.push(officeLldCall);
  }
  if (parsedMerits?.gt(BN_ZERO)) {
    const llmCall = api.tx.llm.sendLlmToPolitipool(address, parsedMerits.toString());
    const officeLlmCall = api.tx.identityOffice.execute(llmCall);
    calls.push(officeLlmCall);
  }

  const finalCall = api.tx.utility.batchAll(calls);
  return submitExtrinsic(finalCall, walletAddress, api);
};

const getAdditionals = (itemData, key) => {
  const chunks = [];
  for (let i = 0; i < itemData.length; i += 32) {
    chunks.push([
      { Raw: key },
      { Raw: itemData.substr(i, 32) },
    ]);
  }
  return chunks;
};

const getCitizenAdditionals = (blockNumber, eligible_on_date) => {
  if (!eligible_on_date) return [];

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
    [{ Raw: 'citizen' }, { Raw: '1' }],
    [{ Raw: 'eligible_on' }, { Raw: [...eligible_on_bytes] }],
  ];
};

const getEResidentAdditionals = () => [
  [{ Raw: 'eresident' }, { Raw: '1' }],
];

const getCompanyAdditionals = () => [
  [{ Raw: 'company' }, { Raw: '1' }],
];

const buildAdditionals = (values, blockNumber) => {
  const additionals = [];

  if (values.onChainIdentity === 'citizen') {
    additionals.push(
      ...getCitizenAdditionals(blockNumber, values.eligible_on),
      ...getEResidentAdditionals(),
    );
  } else if (values.onChainIdentity === 'eresident') {
    additionals.push(
      ...getEResidentAdditionals(),
    );
  } else if (values.onChainIdentity === 'company') {
    additionals.push(
      ...getCompanyAdditionals(),
    );
  }

  const additionalItems = ['legal', 'web', 'display', 'email'];

  additionalItems.map((item) => {
    const itemData = values[item];
    if (itemData && itemData.length > 32) {
      additionals.push(
        ...getAdditionals(itemData, item),
      );
    }
    return null;
  });

  return additionals;
};

const setIdentity = async (values, walletAddress) => {
  const asData = (v) => (v ? { Raw: v } : null);
  const truncate = (v) => (v?.length > 32 ? v.substring(0, 32) : v);
  const api = await getApi();
  const blockNumber = await api.derive.chain.bestNumber();
  const info = {
    additional: buildAdditionals(values, blockNumber.toNumber()),
    display: asData(truncate(values.display)),
    legal: asData(truncate(values.legal)),
    web: asData(truncate(values.web)),
    email: asData(truncate(values.email)),
    riot: asData(null),
    image: asData(null),
    twitter: asData(null),
  };

  const setCall = api.tx.identity.setIdentity(info);
  return submitExtrinsic(setCall, walletAddress, api);
};

const getCompanyRequest = async (entity_id) => {
  try {
    const api = await getApi();
    const maybeRequest = await api.query.companyRegistry.requests(0, entity_id);
    if (maybeRequest.isNone) return null;
    const optRequest = maybeRequest.unwrap();
    if (optRequest.isNone) {
      return {
        unregister: true,
      };
    }
    const request = optRequest.unwrap();
    return {
      hash: request.data.hash,
      editableByRegistrar: request.editableByRegistrar,
      data: api.createType('CompanyData', pako.inflate(request.data)),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getCompanyRegistration = async (entity_id) => {
  try {
    const api = await getApi();
    const maybeRegistration = await api.query.companyRegistry.registries(0, entity_id);
    if (maybeRegistration.isNone) return null;
    const registration = maybeRegistration.unwrap();
    return {
      hash: registration.data.hash,
      editableByRegistrar: registration.editableByRegistrar,
      data: api.createType('CompanyData', pako.inflate(registration.data)),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const registerCompany = async ({ entity_id, hash, walletAddress }) => {
  const api = await getApi();
  const registerCall = api.tx.companyRegistry.registerEntity(0, entity_id, hash);
  const proxied = api.tx.companyRegistryOffice.execute(registerCall);
  return submitExtrinsic(proxied, walletAddress, api);
};

export {
  getIdentity,
  createOrUpdateAsset,
  mintAsset,
  getLlmBalances,
  getLldBalances,
  getAssetData,
  getAssetDetails,
  getOfficialRegistryEntries,
  getAdditionalAssets,
  transferWithRemark,
  provideJudgementAndAssets,
  setIdentity,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
};
