import { web3FromAddress } from '@polkadot/extension-dapp';
import pako from 'pako';
import {
  BN_ZERO,
  hexToU8a, u8aToHex,
} from '@polkadot/util';
import { ApiPromise, WsProvider } from '@polkadot/api';
import groupBy from 'lodash/groupBy';
import { USER_ROLES, userRolesHelper } from '../utils/userRolesHelper';
import { handleMyDispatchErrors } from '../utils/therapist';
import * as centralizedBackend from './backend';
// eslint-disable-next-line import/no-cycle
import { convertAssetData } from '../utils/dexFormatter';
import { parseDollars, parseMerits } from '../utils/walletHelpers';
import { blockchainDataToFormObject, getMetadataCache, setMetadataCache } from '../utils/nodeRpcCall';
import { addReturns, calcInflation, getBaseInfo } from '../utils/staking';
import identityJudgementEnums from '../constants/identityJudgementEnums';
import { IndexHelper } from '../utils/council/councilEnum';
import { decodeAndFilter } from '../utils/identityParser';
import { OfficeType } from '../utils/officeTypeEnum';

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);
let __apiCache = null;
const getApi = async () => {
  if (__apiCache === null) {
    __apiCache = await ApiPromise.create({
      provider,
      metadata: getMetadataCache(),
      types: {
        NativeOrAssetId: {
          _enum: {
            Native: null,
            Asset: 'u32',
          },
        },
        Coords: {
          lat: 'u64',
          long: 'u64',
        },
        LandMetadata: {
          demarcation: 'BoundedVec<Coords, u32>',
          type: 'Text',
          status: 'Text',
        },
        Encryptable: {
          value: 'Text',
          isEncrypted: 'bool',
        },
        BrandName: {
          name: 'Encryptable',
        },
        Contact: {
          contact: 'Encryptable',
        },
        OnlineAddress: {
          description: 'Encryptable',
          url: 'Encryptable',
        },
        PhysicalAddress: {
          description: 'Encryptable',
          street: 'Encryptable',
          city: 'Encryptable',
          // Subdivision - state/province/emirate/oblast/etc
          subdivision: 'Encryptable',
          postalCode: 'Encryptable',
          country: 'Encryptable', // FIXME enum?
        },
        Person: {
          walletAddress: 'Encryptable',
          name: 'Encryptable',
          dob: 'Encryptable',
          passportNumber: 'Encryptable',
        },
        Principal: {
          walletAddress: 'Encryptable',
          name: 'Encryptable',
          dob: 'Encryptable',
          passportNumber: 'Encryptable',
          signingAbility: 'Encryptable', // FIXME enum
          signingAbilityConditions: 'Encryptable',
          shares: 'Encryptable', // FIXME integer?
        },
        Shareholder: {
          walletAddress: 'Encryptable',
          name: 'Encryptable',
          dob: 'Encryptable',
          passportNumber: 'Text',
          shares: 'Encryptable', // FIXME integer?
        },
        UBO: {
          walletAddress: 'Encryptable',
          name: 'Encryptable',
          dob: 'Encryptable',
          passportNumber: 'Encryptable',
          signingAbility: 'Encryptable', // FIXME enum
          signingAbilityConditions: 'Encryptable',
        },
        RelevantAsset: {
          assetId: 'Encryptable',
        },
        RelevantContract: {
          contractId: 'Encryptable',
        },
        CompanyData: {
          name: 'Text',
          // Truthful scope of business
          purpose: 'Text',
          logoURL: 'Text',
          charterURL: 'Text',
          totalCapitalAmount: 'Text', // FIXME integer instead? Will have issues with decimals though.
          totalCapitalCurrency: 'Text', // FIXME maybe some enum?
          numberOfShares: 'Text', // FIXME integer instead? Are fractional shares supported
          valuePerShare: 'Text', // FIXME same as totalCapitalAmount probably
          // History of transfer of shares
          history: 'Text', // FIXME array of well defined structs?
          brandNames: 'Vec<BrandName>',
          onlineAddresses: 'Vec<OnlineAddress>',
          physicalAddresses: 'Vec<PhysicalAddress>',
          statutoryOrganMembers: 'Vec<Person>',
          principals: 'Vec<Principal>',
          shareholders: 'Vec<Shareholder>',
          UBOs: 'Vec<UBO>',
          relevantAssets: 'Vec<RelevantAsset>',
          relevantContracts: 'Vec<RelevantContract>',
          companyType: 'Text',
          contact: 'Vec<Contact>',
        },
        RemarkInfo: {
          category: 'Text',
          project: 'Text',
          supplier: 'Text',
          description: 'Text',
          finalDestination: 'Text',
          amountInUSDAtDateOfPayment: 'u64',
          date: 'u64',
          currency: 'Text',
        },
        RemarkInfoUser: {
          id: 'u64',
          description: 'Text',
        },
      },
      runtime: {
        AssetConversionApi: [
          {
            methods: {
              get_reserves: {
                description: 'Get pool reserves',
                params: [
                  {
                    name: 'asset1',
                    type: 'NativeOrAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'NativeOrAssetId',
                  },
                ],
                type: 'Option<(Balance,Balance)>',
              },
              quote_price_exact_tokens_for_tokens: {
                description: 'Quote price: exact tokens for tokens',
                params: [
                  {
                    name: 'asset1',
                    type: 'NativeOrAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'NativeOrAssetId',
                  },
                  {
                    name: 'amount',
                    type: 'u128',
                  },
                  {
                    name: 'include_fee',
                    type: 'bool',
                  },
                ],
                type: 'Option<(Balance)>',
              },
              quote_price_tokens_for_exact_tokens: {
                description: 'Quote price: tokens for exact tokens',
                params: [
                  {
                    name: 'asset1',
                    type: 'NativeOrAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'NativeOrAssetId',
                  },
                  {
                    name: 'amount',
                    type: 'u128',
                  },
                  {
                    name: 'include_fee',
                    type: 'bool',
                  },
                ],
                type: 'Option<(Balance)>',
              },
            },
            version: 1,
          },
        ],
      },
    });
    setMetadataCache(
      __apiCache.genesisHash,
      __apiCache.runtimeVersion.specVersion.toNumber(),
      __apiCache.runtimeMetadata.toHex(),
    );
  }
  return __apiCache;
};

// eslint-disable-next-line max-len
const crossReference = (api, blockchainData, allCentralizedData, motions, isReferendum) => blockchainData.map((item) => {
  const proposalHash = isReferendum ? item.imageHash : (
    item.boundedCall?.lookup?.hash
      ?? item.boundedCall?.legacy?.hash
  );
  const centralizedDatas = allCentralizedData.filter((cItem) => (cItem.hash === proposalHash));
  const blacklistMotionHash = api.tx.democracy.blacklist(
    proposalHash,
    isReferendum ? item.index : null,
  ).method.hash.toString();

  return {
    ...item,
    centralizedDatas,
    blacklistMotion: motions.includes(blacklistMotionHash) ? blacklistMotionHash : null,
  };
});

const submitExtrinsic = async (extrinsic, walletAddress, api) => {
  const { signer } = await web3FromAddress(walletAddress);
  return new Promise((resolve, reject) => {
    extrinsic.signAndSend(
      walletAddress,
      { signer, withSignedTransaction: true },
      ({ status, events, dispatchError }) => {
        const errorData = handleMyDispatchErrors(dispatchError, api);
        if (status.isInBlock) {
          const blockHash = status.asInBlock.toString();
          // eslint-disable-next-line no-console
          console.log(errorData, events);
          if (errorData.isError) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              blockHash, status, events, errorData,
            });
          } else resolve({ blockHash, status, events });
        }
      },
    ).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      reject(err);
    });
  });
};

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
      withController: true,
      withExposure: true,
      withExposureMeta: true,
      withPrefs: true,
      withClaimedRewardsEras: true,
      withLedger: true,
    }),
    api.derive.staking.waitingInfo({ withController: true, withPrefs: true, withLedger: true }),
    api.query.staking.validators.keys(),
  ]);
  const totalIssuance = await api.query.balances?.totalIssuance();
  const baseInfo = await getBaseInfo(api, elected, waiting);
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

const delegateDemocracy = async (delegateeAddress, walletAddress) => {
  const api = await getApi();
  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();
  const delegateExtrinsic = api.tx.democracy.delegate(delegateeAddress, 'None', LLMPolitiPoolData);
  return submitExtrinsic(delegateExtrinsic, walletAddress, api);
};

const undelegateDemocracy = async (walletAddress) => {
  const api = await getApi();
  const undelegateExtrinsic = api.tx.democracy.undelegate();
  return submitExtrinsic(undelegateExtrinsic, walletAddress, api);
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
      nextExternal,
    ] = await Promise.all([ // api.queryMulti doesnt work with api.derive :(
      api.derive.democracy.referendums(),
      api.derive.democracy.referendumsActive(),
      api.derive.democracy.nextExternal(),
    ]);

    const proposalData = proposals.map((proposalItem) => ({
      index: proposalItem[0].toNumber(),
      boundedCall: proposalItem[1].toJSON(),
      proposer: proposalItem[2].toString(),
    }));

    const deposits = await api.query.democracy.depositOf.multi(proposalData.map(({ index }) => index));

    const proposalsWithDeposits = proposalData.map((proposal, idx) => (
      {
        seconds: deposits[idx].toHuman()[0],
        ...proposal,
      }
    ));

    const motions = (await api.query.council.proposals())
      .map((propose) => propose.toString());
    const centralizedReferendumsData = await centralizedBackend.getReferenda();
    const crossReferencedReferendumsData = crossReference(
      api,
      apideriveReferendums,
      centralizedReferendumsData,
      motions,
      true,
    );
    const crossReferencedProposalsData = crossReference(
      api,
      proposalsWithDeposits,
      centralizedReferendumsData,
      motions,
      false,
    );

    return {
      proposalData,
      apideriveReferendums,
      crossReferencedReferendumsData,
      crossReferencedProposalsData,
      apideriveReferendumsActive,
      userVotes: userVotes.toHuman(),
      centralizedReferendumsData,
      nextExternal,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {};
  }
};

const voteOnReferendum = async (walletAddress, referendumIndex, voteType) => {
  const api = await getApi();
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

  return submitExtrinsic(voteExtrinsic, walletAddress, api);
};

const submitProposal = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  year,
  index,
  sections,
  walletAddress,
) => {
  const api = await getApi();

  const proposal = api.tx.liberlandLegislation.addLegislation(
    tier,
    { year, index },
    sections,
  ).method;
  const { hash } = proposal;
  await centralizedBackend.addReferendum({
    link: discussionLink,
    name: discussionName,
    description: discussionDescription,
    hash,
    additionalMetadata: {},
    proposerAddress: walletAddress,
  });
  const minDeposit = api.consts.democracy.minimumDeposit;
  const proposeCall = tier === 'Constitution' ? api.tx.democracy.proposeRichOrigin : api.tx.democracy.propose;
  const proposeTx = proposeCall({
    Lookup: {
      hash,
      len: proposal.encodedLength,
    },
  }, minDeposit);

  const existingPreimage = await api.query.preimage.preimageFor([proposal.hash, proposal.encodedLength]);
  const extrinsic = existingPreimage.isNone
    ? api.tx.utility.batchAll([
      api.tx.preimage.notePreimage(proposal.toHex()),
      proposeTx,
    ])
    : proposeTx;

  return submitExtrinsic(extrinsic, walletAddress, api);
};

async function getIdentityDataProper(addressesIdentityData) {
  const api = await getApi();
  if (addressesIdentityData.length === 0) return [];
  const identityQueries = addressesIdentityData.map((address) => [api.query.identity.identityOf, address]);
  const identities = await api.queryMulti(identityQueries);
  return addressesIdentityData.map((address, index) => {
    const identity = identities[index];

    const isIdentity = identity.isSome;

    const addressString = address.toString();
    let nameData;
    let legalData;
    let websiteData;
    if (isIdentity) {
      const identityData = identity.unwrap();
      const { info } = identityData;
      const decodedData = decodeAndFilter(info, ['display', 'web', 'legal']);
      nameData = decodedData?.display;
      legalData = decodedData?.legal;
      websiteData = decodedData?.web;
    }
    return {
      name: nameData,
      legal: legalData,
      website: websiteData,
      identityData: identity.isSome ? identity.unwrap().toJSON() : null,
      rawIdentity: addressString,
    };
  });
}

const getCongressMembersWithIdentity = async (walletAddress) => {
  const api = await getApi();
  const [
    councilMembers,
    candidates,
    currentCandidateVotesByUserQuery,
    runnersUp,
  ] = await api.queryMulti([
    api.query.council.members,
    api.query.elections.candidates,
    [api.query.elections.voting, walletAddress],
    api.query.elections.runnersUp,
  ]);

  const councilMembersList = councilMembers.map((member) => member.toString());
  const candidatesList = candidates.map((candidate) => candidate[0].toString());
  const currentCandidateVotesByUser = !currentCandidateVotesByUserQuery.isEmpty
    ? currentCandidateVotesByUserQuery.votes.map((vote) => vote.toString())
    : [];
  const runnersUpList = runnersUp.map(([who]) => who[1].toString());

  const [
    crossReferencedCouncilMemberIdentities,
    crossReferencedCandidateIdentities,
    crossReferencedCurrentCandidateVotesByUser,
    runnersUpListIdentities,
  ] = await Promise.all([
    getIdentityDataProper(councilMembersList),
    getIdentityDataProper(candidatesList),
    getIdentityDataProper(currentCandidateVotesByUser),
    getIdentityDataProper(runnersUpList),
  ]);

  const electionsInfo = await api.derive.elections.info();

  /*
    const allVotes = useCall(api.derive.council.votes, undefined, transformVotes);
  */

  return {
    electionsInfo,
    runnersUp: runnersUpListIdentities,
    currentCongressMembers: crossReferencedCouncilMemberIdentities,
    candidates: crossReferencedCandidateIdentities,
    currentCandidateVotesByUser: crossReferencedCurrentCandidateVotesByUser,
  };
};

const voteForCongress = async (listofVotes, walletAddress) => {
  const api = await getApi();
  if (listofVotes.length < 1) {
    const voteExtrinsic = api.tx.elections.removeVoter();
    return submitExtrinsic(voteExtrinsic, walletAddress, api);
  }
  const votes = listofVotes.map((vote) => vote.rawIdentity);

  const LLMPolitiPool = await api.query.llm.llmPolitics(walletAddress);
  const LLMPolitiPoolData = LLMPolitiPool.toJSON();

  const voteExtrinsic = api.tx.elections.vote(votes, LLMPolitiPoolData);
  return submitExtrinsic(voteExtrinsic, walletAddress, api);
};

const castVetoForLegislation = async (tier, id, section, walletAddress) => {
  const api = await getApi();
  const vetoExtrinsic = api.tx.liberlandLegislation.submitVeto(tier, id, section);
  return submitExtrinsic(vetoExtrinsic, walletAddress, api);
};

const revertVetoForLegislation = async (tier, id, section, walletAddress) => {
  const api = await getApi();
  const vetoExtrinsic = api.tx.liberlandLegislation.revertVeto(tier, id, section);
  return submitExtrinsic(vetoExtrinsic, walletAddress, api);
};

const getLegislation = async (tier) => {
  const api = await getApi();

  const legislation = await api.query.liberlandLegislation.legislation.entries(
    tier,
  );
  const legislationById = legislation.reduce(
    (acc, part) => {
      const [{ args: key }, content] = part;
      const { year, index } = key[1];
      const sectionId = key[2].toNumber();
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][index]) {
        acc[year][index] = { id: { year, index }, vetos: [], sections: [] };
      }
      acc[year][index].sections[sectionId] = { vetos: [], content };
      return acc;
    },
    {},
  );
  Object.keys(legislationById).forEach((year) => {
    Object.keys(legislationById[year] || {}).forEach((index) => {
      const { sections } = legislationById[year][index] || {};
      if (sections) {
        legislationById[year][index].sections = sections.filter(Boolean); // Make sure no "undefined" sections exist
      }
    });
  });

  const vetos = await api.query.liberlandLegislation.vetos.entries(tier);
  vetos
    .filter(([_, isVeto]) => isVeto)
    .forEach(([key]) => {
      // eslint-disable-next-line no-unused-vars
      const [_, { year, index }, section, accountId] = key.args;
      if (!legislationById[year]) legislationById[year] = {};
      if (!legislationById[year][index]) {
        legislationById[year][index] = {
          id: { year, index },
          vetos: [],
          sections: [],
        };
      }
      if (section.isSome) {
        const sectionId = section.unwrap().toNumber();
        if (!legislationById[year][index].sections[sectionId]) return;
        legislationById[year][index].sections[sectionId].vetos.push(accountId);
      } else {
        if (!legislationById[year][index]) return;
        legislationById[year][index].vetos.push(accountId);
      }
    });

  const motions = (await api.query.council.proposals()).map((propose) => propose.toString());
  const publicProps = (await api.query.democracy.publicProps())
    .map((proposal) => {
      if (proposal[1].isLegacy) return proposal[1].asLegacy.hash_.toString();
      if (proposal[1].isLookup) return proposal[1].asLookup.hash_.toString();
      return null;
    }).filter((el) => el);

  const referendums = await api.query.democracy.referendumInfoOf.entries();
  const referendumProposals = referendums
    .map(([_, referendum]) => {
      const unwrapedReferendum = referendum.unwrapOr(null);
      if (!unwrapedReferendum?.isOngoing) return null;
      const { proposal } = unwrapedReferendum.asOngoing;
      if (proposal.isLookup) return proposal.asLookup.hash_.toString();
      if (proposal.isLegacy) return proposal.asLegacy.hash_.toString();
      return null;
    })
    .filter((el) => el);

  const legislationVersionEntries = await api.query.liberlandLegislation.legislationVersion.entries(tier);
  const repealLegislationHashes = legislationVersionEntries.reduce(
    (acc, [{ args: key }, witness]) => {
      const { year, index } = key[1];
      if (!acc[year]) acc[year] = {};
      if (!acc[year][index]) {
        acc[year][index] = {
          sections: [],
          proposalContent: api.tx.liberlandLegislation.repealLegislation(
            tier,
            { year, index },
            witness,
          ).method.hash.toString(),
        };
      }
      acc[year][index].sections.push({
        proposalContent: api.tx.liberlandLegislation.repealLegislationSection(
          tier,
          { year, index },
          acc[year][index].sections.length,
          witness,
        ).method.hash.toString(),
      });
      return acc;
    },
    {},
  );

  Object.entries(legislationById).forEach(([year, legislations]) => {
    Object.entries(legislations).forEach(([index, { sections }]) => {
      /* eslint-disable max-len */
      const mainrepealLegislationHash = repealLegislationHashes[year][index].proposalContent;
      legislationById[year][index].repealMotion = motions.includes(mainrepealLegislationHash) ? mainrepealLegislationHash : null;
      legislationById[year][index].repealReferendum = referendumProposals.includes(mainrepealLegislationHash) ? mainrepealLegislationHash : null;
      legislationById[year][index].repealProposal = publicProps.includes(mainrepealLegislationHash) ? mainrepealLegislationHash : null;
      sections.forEach((sectionData, section) => {
        if (sectionData.content.isNone) return;
        const repealLegislationHash = repealLegislationHashes[year][index].sections[section].proposalContent;
        legislationById[year][index].sections[section].repealMotion = motions.includes(repealLegislationHash) ? repealLegislationHash : null;
        legislationById[year][index].sections[section].repealReferendum = referendumProposals.includes(repealLegislationHash) ? repealLegislationHash : null;
        legislationById[year][index].sections[section].repealProposal = publicProps.includes(repealLegislationHash) ? repealLegislationHash : null;
      });
      /* eslint-enable max-len */
    });
  });

  return legislationById;
};

const getOfficialUserRegistryEntries = async (walletAddress) => {
  const api = await getApi();
  const ownerEntites = await api.query.companyRegistry.ownerEntities.entries(walletAddress);

  const ownerEntitesHuman = ownerEntites.map((x) => ({
    key: x[0].toHuman(), value: x[1].toHuman(),
  }));
  const ownsEntityIds = [];
  ownerEntitesHuman.forEach((oe) => {
    ownsEntityIds.push(oe.key[1]);
  });
  const requestQueries = [];
  const registeredQueries = [];
  ownsEntityIds.forEach((entityId) => {
    requestQueries.push([api.query.companyRegistry.requests, [0, entityId]]);
    registeredQueries.push([api.query.companyRegistry.registries, [0, entityId]]);
  });
  let companyRegistryRawData = [];
  // Skip queryMulti if no companies, otherwise errors out
  if (ownsEntityIds.length !== 0) {
    companyRegistryRawData = await api.queryMulti([
      ...requestQueries,
      ...registeredQueries,
    ]);
  }
  const companyRequestsByWallet = [];
  const registeredCompaniesByWallet = [];
  companyRegistryRawData.forEach((companyRegistryEntity, index) => {
    if (companyRegistryEntity.isNone) return;
    let companyData;
    try {
      if (companyRegistryEntity.isNone) return;
      const optCompanyRegistryEntity = companyRegistryEntity.unwrap();
      if (optCompanyRegistryEntity.isNone) companyData = { unregister: true };
      else {
        // eslint-disable-next-line max-len
        const optCompanyRegistryEntityUnwrap = optCompanyRegistryEntity?.isSome ? optCompanyRegistryEntity.unwrap() : optCompanyRegistryEntity;
        const compressed = optCompanyRegistryEntityUnwrap.data;
        companyData = api.createType('CompanyData', pako.inflate(compressed));

        companyData.set('registryAllowedToEdit', optCompanyRegistryEntityUnwrap.editableByRegistrar);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid company data', e);
      if (index < ownsEntityIds.length) {
        const dataObject = { invalid: true, id: ownsEntityIds[index] };
        companyRequestsByWallet.push(dataObject);
      } else {
        const dataObject = { invalid: true, id: ownsEntityIds[index - ownsEntityIds.length] };
        registeredCompaniesByWallet.push(dataObject);
      }
      return;
    }

    // FIXME this is component-specific logic, nodeRpcCall shouldn't do this
    const formObject = blockchainDataToFormObject(companyData);

    if (index < ownsEntityIds.length) {
      const dataObject = { ...formObject, id: ownsEntityIds[index] };
      companyRequestsByWallet.push(dataObject);
    } else {
      const dataObject = { ...formObject, id: ownsEntityIds[index - ownsEntityIds.length] };
      registeredCompaniesByWallet.push(dataObject);
    }
  });

  // const METAVERSTE_NFTs_ID = 1;
  // const LAND_NFTs_ID = 0;

  const metaverseLandForOwner = [];
  const landForOwner = [];

  // const ownerLand = await Promise.all([
  //   api.query.nfts.account.entries(walletAddress, LAND_NFTs_ID),
  //   api.query.nfts.account.entries(walletAddress, METAVERSTE_NFTs_ID),
  // ]);

  const landForOwnerIds = [];
  const landMetadataQueries = [];
  const metaverseLandForOwnerIds = [];
  const metaverseLandMetadataQueries = [];
  // const ownerLandHuman = ownerLand[0].map((x) => {
  //   const landObject = { ...x[0].toHuman() };
  //   landForOwnerIds.push(landObject[2]);
  //   landMetadataQueries.push([api.query.nfts.itemMetadataOf, [LAND_NFTs_ID, parseInt(landObject[2])]]);
  //   return landObject;
  // });
  // const ownerMetaverseLandHuman = ownerLand[1].map((x) => {
  //   const metaverseLandObject = { ...x[0].toHuman() };
  //   metaverseLandForOwnerIds.push(metaverseLandObject[2]);
  // eslint-disable-next-line max-len
  //   metaverseLandMetadataQueries.push([api.query.nfts.itemMetadataOf, [METAVERSTE_NFTs_ID, parseInt(metaverseLandObject[2])]]);
  //   return metaverseLandObject;
  // });

  let landAttributes = [];
  // only query if something to query, otherwise never resolves
  if (landMetadataQueries.length !== 0 || metaverseLandMetadataQueries.length !== 0) {
    landAttributes = await api.queryMulti([
      ...landMetadataQueries,
      ...metaverseLandMetadataQueries,
    ]);
  }

  landAttributes.forEach((landAttribute, index) => {
    if (index < landForOwnerIds.length) {
      landForOwner.push({ id: landForOwnerIds[index], data: landAttribute.toHuman() });
    } else {
      const id = metaverseLandForOwnerIds[index - landForOwnerIds.length];
      metaverseLandForOwner.push({ id, data: landAttribute.toHuman() });
    }
  });

  return {
    companies: {
      registered: registeredCompaniesByWallet,
      requested: companyRequestsByWallet,
    },
    land: {
      physical: landForOwner,
      metaverse: metaverseLandForOwner,
    },
    assets: [],
    other: [],
  };
};

const requestCompanyRegistration = async (companyData, registryAllowedToEdit, walletAddress) => {
  const api = await getApi();

  const data = api.createType('CompanyData', companyData);
  const compressed = pako.deflate(data.toU8a());
  const extrinsic = api.tx.companyRegistry.requestEntity(0, u8aToHex(compressed), !!registryAllowedToEdit);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const requestEditCompanyRegistration = async (companyData, companyId, walletAddress, registryAllowedToEdit) => {
  const api = await getApi();

  const data = api.createType('CompanyData', companyData);
  const compressed = pako.deflate(data.toU8a());

  const extrinsic = api.tx.companyRegistry.requestRegistration(
    0,
    companyId,
    u8aToHex(compressed),
    !!registryAllowedToEdit,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getCitizenCount = async () => {
  try {
    const api = await getApi();
    const count = await api.query.llm.citizens();
    return count.toNumber();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
};

const getLandNFTMetadataJson = async (collection_id, nft_id) => {
  const api = await getApi();

  const result = await api.query.nfts.itemMetadataOf(collection_id, nft_id);
  const rawMetadata = result.unwrap().data; // unwrap will fail if there's no metadata for this item
  const metadataUint = api.createType('LandMetadata', rawMetadata).toJSON();
  const metadata = {
    ...metadataUint,
    demarcation: metadataUint.demarcation.map((c) => ({
      lat: c.lat / 10000000,
      long: c.long / 10000000,
    })),
  };
  return metadata;
};

const setLandNFTMetadata = async (collection_id, nft_id, metadata, walletAddress) => {
  const injector = await web3FromAddress(walletAddress);
  const api = await getApi();
  /* let metadata = {
    type: "test",
    status: "test",
    demarcation: [
      { lat: 45.7723532, long: 18.8870918 },
      { lat: 45.7721717, long: 18.8871917 },
      { lat: 45.7723330, long: 18.8877504 },
    ]
  }; */

  // SCALE doesn't support floats, we need to convert coords to int
  const metadataUint = {
    ...metadata,
    demarcation: metadata.demarcation.map((c) => ({
      lat: parseInt(c.lat * 10000000),
      long: parseInt(c.long * 10000000),
    })),
  };
  const polkadotJsApiObject = api.createType('LandMetadata', metadataUint);
  const scaleEncoded = polkadotJsApiObject.toHex();

  const metadataExtrinsic = api.tx.nfts.setMetadata(collection_id, nft_id, scaleEncoded);
  const officeExtrinsic = api.tx.metaverseLandRegistryOffice.execute(metadataExtrinsic);
  // scaleEncoded is ready to be used for setting metadata
  // eslint-disable-next-line max-len
  // this data will be validated and will be rejected if encoded incorrectly or data is nonsensical (not on liberland island, self-intersecting plot lines, less then 3 points)
  officeExtrinsic.signAndSend(walletAddress, { signer: injector.signer, withSignedTransaction: true }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed REQUEST COMPANY REGISTRATION at block hash #${status.asInBlock.toString()}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(':( transaction EDIT METADATA failed', error);
  });
};

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
};

const getVotesList = (voting) => {
  const votingUnwrapped = voting.isSome ? voting.unwrap() : null;
  if (!votingUnwrapped) return null;
  const ayes = votingUnwrapped.ayes.map((item) => item.toString());
  const nays = votingUnwrapped.nays.map((item) => item.toString());
  return ayes.concat(nays);
};

const getMotions = async () => {
  const api = await getApi();
  const proposals = await api.query.council.proposals();

  return Promise.all(
    proposals.map(async (proposal) => {
      const [proposalOf, voting, members] = await api.queryMulti([
        [api.query.council.proposalOf, proposal],
        [api.query.council.voting, proposal],
        [api.query.council.members],
      ]);

      const votes = getVotesList(voting);
      return {
        proposal,
        proposalOf,
        voting,
        votes,
        membersCount: members.length,
      };
    }),
  );
};

const getCongressCandidates = async () => {
  const api = await getApi();
  const electionsCandidates = await api.query.elections.candidates();
  return electionsCandidates.toHuman();
};

const getCongressMembers = async () => {
  const api = await getApi();
  return api.query.council.members();
};

const getRunnersUp = async () => {
  const api = await getApi();
  return api.query.elections.runnersUp();
};

const renounceCandidacy = async (walletAddress, userStatus) => {
  const api = await getApi();

  if (userStatus === 'None') return null;

  const renounce = {
    [userStatus]: userStatus === 'Candidate'
      ? (await api.query.elections.candidates()).length : null,
  };
  const renounceCandidacyTx = await api.tx.elections.renounceCandidacy(
    renounce,
  );

  return submitExtrinsic(renounceCandidacyTx, walletAddress, api);
};

const applyForCongress = async (walletAddress) => {
  const api = await getApi();
  const electionsCandidates = await api.query.elections.candidates();
  const extrinsic = api.tx.elections.submitCandidacy(electionsCandidates.length);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const voteAtMotions = async (walletAddress, proposal, index, vote) => {
  const api = await getApi();
  const extrinsic = api.tx.council.vote(proposal, index, vote);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const congressMajorityThreshold = async () => {
  const api = await getApi();
  const congressmen = await api.query.council.members();
  return Math.trunc(congressmen.length / 2) + 1;
};

const createProposalAndVote = async (threshold, proposalContent, vote) => {
  const api = await getApi();
  const proposal = api.tx.council.propose(threshold, proposalContent, proposalContent.length);

  const nextProposalIndex = await api.query.council.proposalCount();
  const voteAye = api.tx.council.vote(proposalContent.method.hash, nextProposalIndex, vote);

  return [proposal, voteAye];
};

const handleCreateProposalAndVote = async (threshold, proposalData, walletAddress) => {
  const api = await getApi();
  const [proposal, voteAye] = await createProposalAndVote(threshold, proposalData, true);

  if (threshold === 1) {
    return submitExtrinsic(proposal, walletAddress, api);
  }

  const extrinsic = api.tx.utility.batchAll([proposal, voteAye]);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const congressProposeSpend = async ({
  walletAddress, spendProposal, remarkInfo, executionBlock,
}) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();
  const remark = api.tx.llm.remark(remarkInfo);
  const transferAndRemark = api.tx.utility.batchAll([spendProposal, remark]);

  const executeProposal = api.tx.scheduler.schedule(executionBlock, null, 0, transferAndRemark);
  const proposal = api.tx.councilAccount.execute(executeProposal);

  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const createSenateProposalAndVote = async (threshold, proposalContent, vote) => {
  const api = await getApi();
  const proposal = api.tx.senate.propose(threshold, proposalContent, proposalContent.length);
  const nextProposalIndex = await api.query.senate.proposalCount();
  const voteAye = api.tx.senate.vote(proposalContent.method.hash, nextProposalIndex, vote);

  return [proposal, voteAye];
};

const senateMajorityThreshold = async () => {
  const api = await getApi();
  const senateMember = await api.query.senate.members();
  return Math.trunc(senateMember.length / 2) + 1;
};

const senateProposeSpend = async ({
  walletAddress, spendProposal, remarkInfo,
}) => {
  const api = await getApi();

  const remark = api.tx.llm.remark(remarkInfo);
  const transferAndRemark = api.tx.utility.batchAll([spendProposal, remark]);
  const proposalData = api.tx.senateAccount.execute(transferAndRemark);
  const threshold = await senateMajorityThreshold();
  const [proposal, voteAye] = await createSenateProposalAndVote(threshold, proposalData, true);

  if (threshold === 1) {
    return submitExtrinsic(proposal, walletAddress, api);
  }

  const extrinsic = api.tx.utility.batchAll([proposal, voteAye]);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getClerksMinistryFinance = async () => {
  const api = await getApi();
  const keys = await api.query.ministryOfFinanceOffice.clerks.keys();
  if (keys.length < 1) {
    return null;
  }
  return keys.map((item) => item.args.toString());
};

const ministryFinanceSpend = async ({
  walletAddress, spendProposal, remarkInfo,
}) => {
  const api = await getApi();

  const remark = api.tx.llm.remark(remarkInfo);
  const transferAndRemark = api.tx.utility.batchAll([spendProposal, remark]);
  const extrinsic = api.tx.ministryOfFinanceOffice.execute(transferAndRemark);

  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getProperProposal = async (officeType) => {
  if (officeType === OfficeType.CONGRESS) {
    return congressProposeSpend;
  } if (officeType === OfficeType.SENATE) {
    return senateProposeSpend;
  } if (officeType === OfficeType.MINISTRY_FINANCE) {
    return ministryFinanceSpend;
  }
  return null;
};

const congressSenateSendLlm = async ({
  walletAddress, transferToAddress, transferAmount, remarkInfo, executionBlock, officeType,
}) => {
  const api = await getApi();
  const spendProposal = api.tx.llm.sendLlm(transferToAddress, transferAmount);
  const proposeSend = await getProperProposal(officeType);

  return proposeSend({
    walletAddress, spendProposal, remarkInfo, executionBlock,
  });
};

const congressSenateSendLld = async ({
  walletAddress, transferToAddress, transferAmount, remarkInfo, executionBlock, officeType,
}) => {
  const api = await getApi();
  const spendProposal = api.tx.balances.transfer(transferToAddress, transferAmount);
  const proposeSend = await getProperProposal(officeType);

  return proposeSend({
    walletAddress, spendProposal, remarkInfo, executionBlock,
  });
};

const congressSenateSendLlmToPolitipool = async ({
  walletAddress, transferToAddress, transferAmount, remarkInfo, executionBlock, officeType,
}) => {
  const api = await getApi();
  const spendProposal = api.tx.llm.sendLlmToPolitipool(transferToAddress, transferAmount);
  const proposeSend = await getProperProposal(officeType);

  return proposeSend({
    walletAddress, spendProposal, remarkInfo, executionBlock,
  });
};

const congressSenateSendAssets = async ({
  walletAddress,
  transferToAddress,
  transferAmount,
  assetData,
  remarkInfo,
  executionBlock,
  officeType,
}) => {
  const api = await getApi();
  const spendProposal = api.tx.assets.transfer(parseInt(assetData.index), transferToAddress, transferAmount);
  const proposeSend = await getProperProposal(officeType);

  return proposeSend({
    walletAddress, spendProposal, remarkInfo, executionBlock,
  });
};
const congressProposeBudget = async ({
  walletAddress, itemsCouncilPropose, executionBlock,
}) => {
  const api = await getApi();
  const proposeBudget = itemsCouncilPropose.map((itemCouncilPropose) => {
    const { transfer, remark: remarkInfo } = itemCouncilPropose;
    const { index, balance, recipient } = transfer;

    const remark = api.tx.llm.remark(remarkInfo);
    let transferProposal;

    if (index === IndexHelper.LLD) {
      transferProposal = api.tx.balances.transfer(recipient, balance);
    } else if (index === IndexHelper.POLITIPOOL_LLM) {
      transferProposal = api.tx.llm.sendLlmToPolitipool(recipient, balance);
    } else {
      transferProposal = api.tx.assets.transfer(parseInt(index), recipient, balance);
    }

    return { transferProposal, remark };
  });
  const threshold = await congressMajorityThreshold();
  const transferAndRemark = api.tx.utility
    .batchAll(proposeBudget.flatMap((item) => [item.transferProposal, item.remark]));
  const executeProposal = api.tx.scheduler.schedule(executionBlock, null, 0, transferAndRemark);
  const proposal = api.tx.councilAccount.execute(executeProposal);

  const extrinsics = await createProposalAndVote(threshold, proposal, true);
  const extrinsic = api.tx.utility.batchAll(extrinsics);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const senateVoteAtMotions = async (walletAddress, proposal, index, vote) => {
  const api = await getApi();
  const extrinsic = api.tx.senate.vote(proposal, index, vote);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

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

const congressProposeLegislation = async (tier, id, sections, walletAddress) => {
  const api = await getApi();
  const threshold = await congressMajorityThreshold();
  const proposal = api.tx.liberlandLegislation.addLegislation(tier, id, sections);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const congressRepealLegislation = async (tier, id, section, walletAddress) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();

  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const proposal = section !== null
    ? api.tx.liberlandLegislation.repealLegislationSection(tier, id, section, witness)
    : api.tx.liberlandLegislation.repealLegislation(tier, id, witness);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const getTreasurySpendProposals = async () => {
  const api = await getApi();
  return api.derive.treasury.proposals();
};

const getTreasurySpendPeriod = async () => {
  const api = await getApi();
  return api.consts.treasury.spendPeriod;
};

const getTreasuryBudget = async () => {
  const api = await getApi();
  const account = '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z';
  const balances = await api.derive.balances.account(account);
  return balances.freeBalance;
};

const congressApproveTreasurySpend = async (proposalId, walletAddress) => {
  const api = await getApi();
  const threshold = await congressMajorityThreshold();
  const proposal = api.tx.treasury.approveProposal(proposalId);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const congressUnapproveTreasurySpend = async (proposalId, walletAddress) => {
  const api = await getApi();
  const threshold = await congressMajorityThreshold();
  const proposal = api.tx.treasury.removeApproval(proposalId);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const closeCongressMotion = async (proposalHash, index, walletAddress) => {
  const api = await getApi();
  const proposal = await api.query.council.proposalOf(proposalHash);
  const { weight: weightBound } = await api.tx(proposal.unwrap()).paymentInfo(walletAddress);
  const lengthBound = proposal.unwrap().toU8a().length;
  return submitExtrinsic(api.tx.council.close(proposalHash, index, weightBound, lengthBound), walletAddress, api);
};

const congressProposeReferendum = async (
  discussionName,
  discussionDescription,
  discussionLink,
  referendumProposal,
  fastTrack,
  votingPeriod,
  enactmentPeriod,
  walletAddress,
) => {
  const api = await getApi();

  await centralizedBackend.addReferendum({
    link: discussionLink,
    name: discussionName,
    description: discussionDescription,
    hash: referendumProposal.hash,
    additionalMetadata: {},
    proposerAddress: walletAddress,
  });

  const lookup = {
    Lookup: {
      hash_: referendumProposal.hash,
      len: referendumProposal.encodedLength,
    },
  };
  const proposalData = fastTrack
    ? api.tx.utility.batchAll([
      api.tx.democracy.externalPropose(lookup),
      api.tx.democracy.fastTrack(
        referendumProposal.hash,
        votingPeriod,
        enactmentPeriod,
      ),
    ])
    : api.tx.democracy.externalProposeMajority(lookup);

  const threshold = await congressMajorityThreshold();

  const [proposal, voteAye] = await createProposalAndVote(threshold, proposalData, true);

  const proposeAndVote = threshold === 1 ? [proposal] : [proposal, voteAye];
  // eslint-disable-next-line max-len
  const existingPreimage = await api.query.preimage.preimageFor([referendumProposal.hash, referendumProposal.encodedLength]);
  const extrinsic = api.tx.utility.batchAll(
    existingPreimage.isNone
      ? [
        api.tx.preimage.notePreimage(referendumProposal.toHex()),
        ...proposeAndVote,
      ]
      : proposeAndVote,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const congressProposeLegislationViaReferendum = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  id,
  sections,
  fastTrack,
  votingPeriod,
  enactmentPeriod,
  walletAddress,
) => {
  const api = await getApi();
  const addLegislation = api.tx.liberlandLegislation.addLegislation(tier, id, sections).method;
  return congressProposeReferendum(
    discussionName,
    discussionDescription,
    discussionLink,
    addLegislation,
    fastTrack,
    votingPeriod,
    enactmentPeriod,
    walletAddress,
  );
};

const congressProposeRepealLegislation = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  id,
  section,
  fastTrack,
  votingPeriod,
  enactmentPeriod,
  walletAddress,
) => {
  const api = await getApi();
  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const repealLegislation = section !== null
    ? api.tx.liberlandLegislation.repealLegislationSection(tier, id, section, witness).method
    : api.tx.liberlandLegislation.repealLegislation(tier, id, witness).method;
  return congressProposeReferendum(
    discussionName,
    discussionDescription,
    discussionLink,
    repealLegislation,
    fastTrack,
    votingPeriod,
    enactmentPeriod,
    walletAddress,
  );
};

const citizenProposeRepealLegislation = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  id,
  section,
  walletAddress,
) => {
  const api = await getApi();
  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const repealLegislation = section !== null
    ? api.tx.liberlandLegislation.repealLegislationSection(tier, id, section, witness).method
    : api.tx.liberlandLegislation.repealLegislation(tier, id, witness).method;

  await centralizedBackend.addReferendum({
    link: discussionLink,
    name: discussionName,
    description: discussionDescription,
    hash: repealLegislation.hash,
    additionalMetadata: {},
    proposerAddress: walletAddress,
  });

  const minDeposit = api.consts.democracy.minimumDeposit;
  const proposeCall = tier === 'Constitution' ? api.tx.democracy.proposeRichOrigin : api.tx.democracy.propose;
  const proposeTx = proposeCall({
    Lookup: {
      hash_: repealLegislation.hash,
      len: repealLegislation.encodedLength,
    },
  }, minDeposit);

  // eslint-disable-next-line max-len
  const existingPreimage = await api.query.preimage.preimageFor([repealLegislation.hash, repealLegislation.encodedLength]);
  const extrinsic = existingPreimage.isNone
    ? api.tx.utility.batchAll([
      api.tx.preimage.notePreimage(repealLegislation.toHex()),
      proposeTx,
    ])
    : proposeTx;

  return submitExtrinsic(extrinsic, walletAddress, api);
};

const congressSendTreasuryLld = async (transferToAddress, transferAmount, walletAddress) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();
  const proposal = api.tx.treasury.spend(transferAmount, transferToAddress);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const getPalletIds = async () => {
  const api = await getApi();
  // eslint-disable-next-line max-len
  const pallets = Object.entries(api.consts).map(([palletName, palletConsts]) => ({ palletName, palletId: palletConsts.palletId }));
  return pallets.filter((pallet) => pallet.palletId);
};

const congressDemocracyBlacklist = async (proposalHash, referendumIndex, walletAddress) => {
  const api = await getApi();

  const threshold = await congressMajorityThreshold();
  const proposal = api.tx.democracy.blacklist(proposalHash, referendumIndex ?? null);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const proposeAmendLegislation = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  id,
  section,
  content,
  walletAddress,
) => {
  const api = await getApi();
  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const proposal = api.tx.liberlandLegislation.amendLegislation(
    tier,
    id,
    section,
    content,
    witness,
  ).method;
  await centralizedBackend.addReferendum({
    link: discussionLink,
    name: discussionName,
    description: discussionDescription,
    hash: proposal.hash,
    additionalMetadata: {},
    proposerAddress: walletAddress,
  });
  const notePreimageTx = api.tx.preimage.notePreimage(proposal.toHex());
  const minDeposit = api.consts.democracy.minimumDeposit;
  const proposeCall = tier === 'Constitution' ? api.tx.democracy.proposeRichOrigin : api.tx.democracy.propose;
  const proposeTx = proposeCall({
    Lookup: {
      hash: proposal.hash,
      len: proposal.encodedLength,
    },
  }, minDeposit);
  const existingPreimage = await api.query.preimage.preimageFor([proposal.hash, proposal.encodedLength]);
  const extrinsic = existingPreimage.isNone
    ? api.tx.utility.batchAll([notePreimageTx, proposeTx])
    : proposeTx;
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const congressAmendLegislation = async (tier, id, section, content, walletAddress) => {
  const api = await getApi();
  const threshold = await congressMajorityThreshold();
  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const proposal = api.tx.liberlandLegislation.amendLegislation(tier, id, section, content, witness);
  return handleCreateProposalAndVote(threshold, proposal, walletAddress);
};

const congressAmendLegislationViaReferendum = async (
  discussionName,
  discussionDescription,
  discussionLink,
  tier,
  id,
  section,
  content,
  fastTrack,
  votingPeriod,
  enactmentPeriod,
  walletAddress,
) => {
  const api = await getApi();

  const witness = await api.query.liberlandLegislation.legislationVersion(tier, id, section);
  const amendLegislation = api.tx.liberlandLegislation.amendLegislation(
    tier,
    id,
    section,
    content,
    witness,
  ).method;
  return congressProposeReferendum(
    discussionName,
    discussionDescription,
    discussionLink,
    amendLegislation,
    fastTrack,
    votingPeriod,
    enactmentPeriod,
    walletAddress,
  );
};

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

const getSwapPriceExactTokensForTokens = async (asset1, asset2, amount, includeTax = true) => {
  const api = await getApi();

  const maybeRate = await api.call.assetConversionApi.quotePriceExactTokensForTokens(
    asset1,
    asset2,
    amount,
    includeTax,
  );
  return maybeRate.unwrapOr(null);
};

const getSwapPriceTokensForExactTokens = async (asset1, asset2, amount, includeTax = true) => {
  const api = await getApi();

  const maybeRate = await api.call.assetConversionApi.quotePriceTokensForExactTokens(
    asset1,
    asset2,
    amount,
    includeTax,
  );
  return maybeRate.unwrapOr(null);
};

const getDexReserves = async (asset1, asset2) => {
  const api = await getApi();
  const maybeReserves = await api.call.assetConversionApi.getReserves(asset1, asset2);
  if (maybeReserves.isNone) {
    return null;
  }
  const [reservesOfAsset1, reservesOfAsset2] = maybeReserves.unwrap();
  return {
    asset1: reservesOfAsset1,
    asset2: reservesOfAsset2,
  };
};

const getAssetsDataFromPool = async () => {
  const api = await getApi();
  const maybeAssetDataFromPool = await api.query.poolAssets.asset.entries();
  const data = {};
  maybeAssetDataFromPool.map((item) => {
    const asset = item[0].toHuman()[0];
    const { supply } = item[1].unwrapOr(null);
    data[asset] = { supply };
    return { supply, asset };
  });
  return data;
};

const getLpTokensOwnedByAddress = async (lpTokenId, address) => {
  const api = await getApi();
  const maybeTokens = await api.query.poolAssets.account(lpTokenId, address);

  if (maybeTokens.isNone) {
    return null;
  }
  const tokens = maybeTokens.unwrapOrDefault();
  const { balance } = tokens;
  return { balance };
};

const getDexPools = async (walletAddress) => {
  try {
    const api = await getApi();
    const pools = await api.query.assetConversion.pools.entries();
    const assetsPoolData = await getAssetsDataFromPool();
    const poolsData = await Promise.all(pools.map(async ([poolKey, maybePoolData]) => {
      const [asset1, asset2] = poolKey.args[0];
      const { lpToken } = maybePoolData.unwrapOrDefault();
      const asset1checkIsNative = asset1.value.toString();
      const asset2checkIsNative = asset2.value.toString();
      const asset2Transform = asset2checkIsNative || asset2.toString();
      const asset1Transform = asset1checkIsNative || asset1.toString();
      const lpTokenTransform = lpToken.toString();
      const [lpTokensValue, reserved, assetsData] = await Promise.all([
        getLpTokensOwnedByAddress(lpTokenTransform, walletAddress),
        getDexReserves(asset1, asset2),
        getAdditionalAssets(walletAddress, true, true),
      ]);
      const { assetData1, assetData2 } = convertAssetData(assetsData, asset1Transform, asset2Transform);
      return {
        asset1: asset1Transform,
        asset2: asset2Transform,
        assetData1,
        assetData2,
        lpToken: lpTokenTransform,
        lpTokensBalance: lpTokensValue?.balance || BN_ZERO,
        reserved,
        isStock: assetData1?.isStock || assetData2?.isStock || false,
      };
    }));
    return { poolsData, assetsPoolData };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DEX pools:', err);
    return [];
  }
};

const getDexPoolsExtendData = async (walletAddress) => {
  try {
    const dexData = await getDexPools(walletAddress);
    return dexData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DEX pools with extend data: ', error);
    return [];
  }
};

const swapExactTokensForTokens = async (path, amountIn, amountOutMin, sendTo, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.swapExactTokensForTokens(
    path,
    amountIn,
    amountOutMin,
    sendTo,
    true,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const createNewPool = async (aAsset, bAsset, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.createPool(aAsset, bAsset);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const swapTokensForExactTokens = async (path, amountOut, amountInMax, sendTo, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.swapTokensForExactTokens(path, amountOut, amountInMax, sendTo, true);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const addLiquidity = async (
  asset1,
  asset2,
  amount1Desired,
  amount2Desired,
  amount1Min,
  amount2Min,
  mintTo,
  walletAddress,
) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.addLiquidity(
    asset1,
    asset2,
    amount1Desired,
    amount2Desired,
    amount1Min,
    amount2Min,
    mintTo,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getLiquidityWithdrawalFee = async () => {
  const api = await getApi();
  const maybeLiquidityWithdrawalFee = await api.consts.assetConversion.liquidityWithdrawalFee;
  return Number(maybeLiquidityWithdrawalFee);
};

const removeLiquidity = async (
  asset1,
  asset2,
  lpTokenBurn,
  amount1MinReceive,
  amount2MinReceive,
  withdrawTo,
  walletAddress,
) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.removeLiquidity(
    asset1,
    asset2,
    lpTokenBurn,
    amount1MinReceive,
    amount2MinReceive,
    withdrawTo,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const fetchCompanyRequests = async () => {
  const api = await getApi();
  const raw = await api.query.companyRegistry.requests.entries();
  return raw.map((rawEntry) => ({
    indexes: rawEntry[0].toHuman(),
  }));
};

const handleContractData = (data) => {
  let result = null;
  if (!data) return result;
  try {
    const hexData = data.toString('hex');
    result = Buffer.from(pako.inflate(hexToU8a(hexData))).toString('utf-8');
  } catch (err) {
    result = Buffer.from(data).toString('utf-8');
  }
  return result;
};

const getSignaturesForContracts = async (contractId) => {
  const api = await getApi();
  const judgesSignatures = await api.query.contractsRegistry.judgesSignatures.entries(contractId);
  const judgesSignaturesList = judgesSignatures.map(
    ([key, isSigned]) => ({ key: key.args[1].toString(), isSigned: isSigned.isTrue }),
  );
  const partiesSignatures = await api.query.contractsRegistry.partiesSignatures.entries(contractId);
  const partiesSignaturesList = partiesSignatures.map(
    ([key, isSigned]) => ({ key: key.args[1].toString(), isSigned: isSigned.isTrue }),
  );
  const judgesFiltered = judgesSignaturesList.filter((item) => item.isSigned === true);
  const partiesFiltered = partiesSignaturesList.filter((item) => item.isSigned === true);

  return { judgesSignaturesList: judgesFiltered, partiesSignaturesList: partiesFiltered };
};

const getSingleContract = async (contractId) => {
  const api = await getApi();
  const contract = await api.query.contractsRegistry.contracts(contractId);
  const contractUnwrap = contract.unwrapOr(null);
  const data = handleContractData(contractUnwrap?.data);
  const parties = (contract?.parties && contract?.parties.length > 0)
    ? contract?.parties.map((party) => party.toString())
    : [];

  const { judgesSignaturesList, partiesSignaturesList } = await getSignaturesForContracts(contractId);

  const keysArrayJudges = judgesSignaturesList.map((obj) => obj.key);
  const keysArrayParties = partiesSignaturesList.map((obj) => obj.key);

  return {
    contractId: contractId.toString(),
    data,
    parties,
    creator: contractUnwrap?.creator.toString(),
    deposit: contractUnwrap?.deposit.toString(),
    judgesSignaturesList: keysArrayJudges,
    partiesSignaturesList: keysArrayParties,
  };
};

const getAllContracts = async () => {
  const api = await getApi();
  const rawContracts = await api.query.contractsRegistry.contracts.entries();

  const contractPromises = rawContracts.map(async ([id, maybeContract]) => {
    const contractId = id.args[0];
    const contract = maybeContract.unwrapOr(null);
    const data = handleContractData(contract?.data);

    const { judgesSignaturesList, partiesSignaturesList } = await getSignaturesForContracts(contractId);
    const parties = (contract?.parties && contract?.parties.length > 0)
      ? contract?.parties.map((party) => party.toString())
      : [];
    const keysArrayJudges = judgesSignaturesList.map((obj) => obj.key);
    const keysArrayParties = partiesSignaturesList.map((obj) => obj.key);
    return {
      contractId: contractId.toString(),
      data,
      parties,
      creator: contract?.creator.toString(),
      deposit: contract?.deposit.toString(),
      judgesSignaturesList: keysArrayJudges,
      partiesSignaturesList: keysArrayParties,
    };
  });

  const contracts = await Promise.all(contractPromises);

  return contracts;
};

const signContractAsParty = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.partySignContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const signContractAsJudge = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.judgeSignContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const removeContract = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.removeContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getAllJudges = async () => {
  const api = await getApi();
  const rawJudges = await api.query.contractsRegistry.judges.entries();
  return rawJudges.filter(([, isJudge]) => isJudge.isTrue).map(([address]) => address.args[0]);
};

const getIsUserJudges = async (walletAddress) => {
  const api = await getApi();
  const rawIsJudge = await api.query.contractsRegistry.judges(walletAddress);
  return rawIsJudge.isTrue;
};

const createContract = async (data, parties, walletAddress) => {
  const api = await getApi();

  const encodedData = new TextEncoder().encode(data);
  const compressed = pako.deflate(encodedData);

  const extrinsic = api.tx.contractsRegistry.createContract(u8aToHex(compressed), parties);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getStakingData = async (walletAddress) => {
  const api = await getApi();
  const [stakingInfo, sessionProgress] = await Promise.all([
    api.derive.staking?.account(walletAddress),
    api.derive.session.progress(),
  ]);

  return { stakingInfo, sessionProgress };
};

const getSenateMotions = async () => {
  const api = await getApi();
  const proposals = await api.query.senate.proposals();

  return Promise.all(
    proposals.map(async (proposal) => {
      const [proposalOf, voting, members] = await api.queryMulti([
        [api.query.senate.proposalOf, proposal],
        [api.query.senate.voting, proposal],
        [api.query.senate.members],
      ]);
      const votes = getVotesList(voting);

      const senateProposalHash = proposalOf.hash.toHex();
      return {
        proposal,
        proposalOf,
        voting,
        votes,
        hash: senateProposalHash,
        membersCount: members.length,
      };
    }),
  ).then((motions) => motions.filter(Boolean));
};

const matchScheduledWithSenateMotions = async () => {
  const [senateMotions, sheduledMotions] = await Promise.all([getSenateMotions(), getScheduledCalls()]);

  const motions = senateMotions.map((motion) => {
    const { proposalOf } = motion;

    const unwrappedProposalOf = proposalOf.unwrap();
    if (unwrappedProposalOf.method === 'cancel' && unwrappedProposalOf.section === 'scheduler') {
      const blockNumber = proposalOf.value.args[0].toString();
      const matchingScheduledCall = sheduledMotions.find(
        (scheduled) => scheduled.blockNumber.toString() === blockNumber,
      );
      if (!matchingScheduledCall) {
        return { ...motion, proposalOf: unwrappedProposalOf };
      }
      const proposalData = { method: unwrappedProposalOf.method, section: unwrappedProposalOf.section };
      const proposalWithDetails = {
        ...proposalData, args: matchingScheduledCall?.preimage || matchingScheduledCall?.proposal,
      };
      return { ...motion, proposalOf: proposalWithDetails };
    }
    return { ...motion, proposalOf: unwrappedProposalOf };
  });
  return motions;
};

const getSenateMembers = async () => {
  const api = await getApi();
  return api.query.senate.members();
};

const senateProposeCancel = async (walletAddress, idx, executionBlock) => {
  const api = await getApi();
  const threshold = await senateMajorityThreshold();
  const executeProposal = api.tx.scheduler.cancel(executionBlock, idx);
  const [proposal, voteAye] = await createSenateProposalAndVote(threshold, executeProposal, true);

  if (threshold === 1) {
    return submitExtrinsic(proposal, walletAddress, api);
  }

  const extrinsic = api.tx.utility.batchAll([proposal, voteAye]);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const closeSenateMotion = async (proposalHash, index, walletAddress) => {
  const api = await getApi();
  const proposal = await api.query.senate.proposalOf(proposalHash);
  const { weight: weightBound } = await api.tx(proposal.unwrap()).paymentInfo(walletAddress);
  const lengthBound = proposal.unwrap().toU8a().length;
  return submitExtrinsic(api.tx.senate.close(proposalHash, index, weightBound, lengthBound), walletAddress, api);
};

const encodeRemarkUser = async (dataToEncode) => {
  const api = await getApi();
  const data = api.createType('RemarkInfoUser', dataToEncode);
  return u8aToHex(pako.deflate(data.toU8a()));
};

const encodeRemark = async (dataToEncode) => {
  const api = await getApi();
  const data = api.createType('RemarkInfo', dataToEncode);
  return u8aToHex(pako.deflate(data.toU8a()));
};

const decodeRemark = async (dataToEncode) => {
  const api = await getApi();
  const encodedData = dataToEncode.toHex();
  const compressedData = hexToU8a(encodedData);
  const decompressed = pako.inflate(compressedData);
  const remarkInfo = api.createType('RemarkInfo', decompressed);

  return remarkInfo;
};

const decoder = new TextDecoder();

function processData(data) {
  const decodedData = decoder.decode(data);
  try {
    return JSON.parse(decodedData);
  } catch (e) {
    return { name: decodedData };
  }
}
const getIpfsHash = (ipfsUrl) => {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.split('/').pop();
  }
  return null;
};

const getMetadataWithoutPinata = (ipfsUrl) => {
  const decoded = JSON.parse(ipfsUrl);
  return decoded;
};

async function processUrlData(ipfsUrl, json = true) {
  try {
    const ipfsHash = getIpfsHash(ipfsUrl);
    if (!ipfsHash) {
      return getMetadataWithoutPinata(ipfsUrl);
    }
    const url = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${ipfsHash}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS data: ${response.status} ${response.statusText}`);
    }
    return json ? await response.json() : response;
  } catch (error) {
    return null;
  }
}

async function checkUserCollection(userAddress) {
  const api = await getApi();
  const collectionKeys = await api.query.nfts.account.entries(userAddress);
  const collectionIds = [];
  const nftIds = [];

  collectionKeys.forEach(([key]) => {
    const [collectionId, nftId] = key.args.slice(1);
    collectionIds.push(collectionId.toString());
    nftIds.push(nftId.toString());
  });
  return [collectionIds, nftIds];
}

const getAllNfts = async (walletAddress, onlyForSale) => {
  const api = await getApi();
  const nftEntries = await api.query.nfts.item.entries();

  const collectionIds = nftEntries.map(([key]) => key.args[0].toString());
  const nftIds = nftEntries.map(([key]) => key.args[1].toString());

  const [userCollectionIds, userNftIds] = await checkUserCollection(walletAddress);

  const [collectionMetadata, itemMetadata] = await Promise.all([
    api.query.nfts.collectionMetadataOf.multi(collectionIds),
    api.query.nfts.itemMetadataOf.multi(collectionIds.map((id, index) => [id, nftIds[index]])),
  ]);

  const nftDetails = await Promise.all(
    nftEntries.map(async ([key], index) => {
      const [collectionId, nftId] = key.args;

      const collectionDataOpt = collectionMetadata[index];
      const collectionMetadataUnwrapped = collectionDataOpt.isNone ? null : collectionDataOpt.unwrap();

      const itemDataOpt = itemMetadata[index];
      const itemMetadataUnwrapped = itemDataOpt.isNone ? null : itemDataOpt.unwrap();
      const processedItemData = itemMetadataUnwrapped
        ? await processUrlData(decoder.decode(itemMetadataUnwrapped.data))
        : null;

      const itemPriceOpt = await api.query.nfts.itemPriceOf(collectionId, nftId);
      const itemPrice = itemPriceOpt.isNone ? null : itemPriceOpt.unwrap()[0].toString();
      const imageUrl = processedItemData?.image || processedItemData?.imageUrl;
      const image = imageUrl ? await processUrlData(imageUrl, false) : null;

      if (onlyForSale && !itemPrice) {
        return null;
      }

      const isUserNft = userCollectionIds.includes(collectionId.toString())
                        && userNftIds.includes(nftId.toString());

      return {
        collectionId: collectionId.toString(),
        nftId: nftId.toString(),
        isUserNft,
        collectionMetadata: {
          name: collectionMetadataUnwrapped?.name?.toString(),
        },
        itemMetadata: {
          ...processedItemData,
          image: image?.url || imageUrl,
          itemPrice,
        },
      };
    }),
  );

  return nftDetails.filter((detail) => detail !== null);
};

const getUserNfts = async (walletAddress) => {
  const api = await getApi();

  const [collectionIds, nftIds] = await checkUserCollection(walletAddress);

  const [collectionMetadata, itemMetadata] = await Promise.all([
    api.query.nfts.collectionMetadataOf.multi(collectionIds),
    api.query.nfts.itemMetadataOf.multi(collectionIds.map((id, index) => [id, nftIds[index]])),
  ]);

  const nftDetails = await Promise.all(
    collectionIds.map(async (collectionId, index) => {
      const collectionDataOpt = collectionMetadata[index];
      const itemDataOpt = itemMetadata[index];
      const collectionData = collectionDataOpt.isNone ? null : collectionDataOpt.unwrap();
      const itemData = itemDataOpt.isNone ? null : itemDataOpt.unwrap();
      const processedCollectionData = collectionData ? processData(collectionData.data) : null;
      const processedItemData = itemData ? await processUrlData(decoder.decode(itemData.data)) : null;
      const imageUrl = processedItemData?.image || processedItemData?.imageUrl;
      const image = imageUrl ? await processUrlData(imageUrl, false) : null;

      const itemPriceOpt = await api.query.nfts.itemPriceOf(collectionId, nftIds[index]);
      const itemPrice = itemPriceOpt.isNone ? null : itemPriceOpt.unwrap()[0].toString();
      return {
        collectionId,
        nftId: nftIds[index],
        collectionMetadata: {
          name: processedCollectionData?.name,
        },
        itemMetadata: {
          ...processedItemData,
          image: image?.url || imageUrl,
          itemPrice,
        },
      };
    }),
  );

  return nftDetails;
};

async function getUserCollection(walletAddress) {
  const api = await getApi();

  const collectionKeys = await api.query.nfts.collectionAccount.keys(walletAddress);

  const collections = collectionKeys.map(({ args: [address, collectionId] }) => ({
    address: address.toString(),
    collectionId: collectionId.toNumber(),
  }));

  return collections;
}

async function createCollectionNfts(admin, config, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.create(admin, config);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function mintNFT(collectionId, itemId, mintTo, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.mint(collectionId, itemId, mintTo, null);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function destroyNFT(collectionId, itemId, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.burn(collectionId, itemId);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function setMetadataNFT(collectionId, itemId, metadataCID, walletAddress) {
  const api = await getApi();
  const metadata = `ipfs://${metadataCID}`;
  const extrinsic = api.tx.nfts.setMetadata(collectionId, itemId, metadata);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function setAttributes(collectionId, itemId, namespace, key, value, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.setAttribute(collectionId, itemId, namespace, key, value);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function sellNFT(collectionId, itemId, price, walletAddress) {
  const api = await getApi();
  const buyer = api.createType('Option<MultiAddress>', null);
  const extrinsic = api.tx.nfts.setPrice(collectionId, itemId, price, buyer);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function bidNFT(collectionId, itemId, bidPrice, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.buyItem(collectionId, itemId, bidPrice);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function transferNFT(collectionId, itemId, newOwner, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.transfer(collectionId, itemId, newOwner);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

export {
  getBalanceByAddress,
  sendTransfer,
  sendTransferLLM,
  sendAssetTransfer,
  stakeToPolkaBondAndExtra,
  politiPool,
  getUserRoleRpc,
  subscribeBestBlockNumber,
  getValidators,
  getNominatorTargets,
  setNominatorTargets,
  getDemocracyReferendums,
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
  getBlockEvents,
  getLlmBalances,
  getLldBalances,
  getAdditionalAssets,
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
  congressProposeLegislationViaReferendum,
  congressProposeRepealLegislation,
  congressSendTreasuryLld,
  getPalletIds,
  congressDemocracyBlacklist,
  proposeAmendLegislation,
  congressAmendLegislation,
  congressAmendLegislationViaReferendum,
  fetchPreimage,
  decodeCall,
  getScheduledCalls,
  citizenProposeRepealLegislation,
  requestEditCompanyRegistration,
  unregisterCompany,
  cancelCompanyRequest,
  setRegisteredCompanyData,
  requestUnregisterCompanyRegistration,
  fetchPendingIdentities,
  fetchCompanyRequests,
  getIdentitiesNames,
  getOfficialRegistryEntries,
  getDexPools,
  getDexPoolsExtendData,
  getDexReserves,
  getSwapPriceExactTokensForTokens,
  getSwapPriceTokensForExactTokens,
  swapExactTokensForTokens,
  swapTokensForExactTokens,
  addLiquidity,
  removeLiquidity,
  getLiquidityWithdrawalFee,
  getLpTokensOwnedByAddress,
  getAllContracts,
  signContractAsParty,
  signContractAsJudge,
  removeContract,
  getAllJudges,
  getIsUserJudges,
  getSingleContract,
  getAssetData,
  createContract,
  getSignaturesForContracts,
  getStakingData,
  congressSenateSendLlm,
  congressSenateSendLld,
  congressSenateSendLlmToPolitipool,
  congressSenateSendAssets,
  getSenateMotions,
  getSenateMembers,
  senateVoteAtMotions,
  closeSenateMotion,
  senateProposeCancel,
  getPreImage,
  congressProposeBudget,
  encodeRemark,
  decodeRemark,
  getUserNfts,
  createCollectionNfts,
  mintNFT,
  destroyNFT,
  setMetadataNFT,
  setAttributes,
  sellNFT,
  bidNFT,
  transferNFT,
  getAllNfts,
  getUserCollection,
  matchScheduledWithSenateMotions,
  createNewPool,
  getAssetDetails,
  createOrUpdateAsset,
  mintAsset,
  transferWithRemark,
  encodeRemarkUser,
  getClerksMinistryFinance,
  updateValidate,
  getValidator,
};
