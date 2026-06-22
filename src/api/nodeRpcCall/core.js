import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { getNetworkRpc } from '../../utils/networkHelpers';
import { getMetadataCache, setMetadataCache } from '../../utils/nodeRpcCall';
import { handleMyDispatchErrors } from '../../utils/therapist';

const provider = new WsProvider(getNetworkRpc());
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

export {
  getApi,
  crossReference,
  submitExtrinsic,
};
