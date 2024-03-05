import axios from 'axios';
import { BN } from '@polkadot/util';
import { getAdditionalAssets } from './nodeRpcCall';

const receiptsQuery = `
    query BridgeReceipts($orderBy: [BridgeReceiptsOrderBy!], $filter: BridgeReceiptFilter) {
      query {
        bridgeReceipts(orderBy: $orderBy, filter: $filter) {
          nodes {
            id,
            receiptId,
            ethRecipient {id},
            amount,
            event {
              section,
              block {
                hash,
                timestamp
              }
            }
          }
        }
      }
    }
`;

const historyTransferQuery = `
  query CombinedQuery(
    $orderByTransfers: [TransfersOrderBy!],
    $filterTransfers: TransferFilter,
    $orderByMerits: [MeritsOrderBy!],
    $filterMerits: MeritFilter,
    $orderByAssetTransfers: [AssetTransfersOrderBy!],
    $filterAssetTransfers: AssetTransferFilter
  ) {
    transfers(orderBy: $orderByTransfers, filter: $filterTransfers) {
      nodes {
        type: __typename
        id
        fromId
        toId
        value
        extrinsicIndex
        eventIndex
        block {
          id
          number
          timestamp
        }
      }
    }

    merits(orderBy: $orderByMerits, filter: $filterMerits) {
      nodes {
        type: __typename
        id
        fromId
        toId
        value
        extrinsicIndex
        eventIndex
        block {
          id
          number
          timestamp
        }
      }
    }

    assetTransfers(orderBy: $orderByAssetTransfers, filter: $filterAssetTransfers) {
      nodes {
        type: __typename
        toId
        fromId
        asset
        value
        block {
          id
          number
          timestamp
        }
      }
    }
  }
`;

const identitiesDataQuery = `
query GetIdentities($name: String!) {
  identities(first: 10, filter: { 
    or: [{ name: { includesInsensitive: $name } }, 
      { id: { includesInsensitive: $name } }
    ] 
  }) 
  {
    nodes {
      id
      name
      isConfirmed
    }
  }
}`;

const getApi = () => axios.create({
  baseURL: process.env.REACT_APP_EXPLORER,
});

const palletToAsset = (pallet) => {
  if (pallet === 'ethLLMBridge') {
    return 'LLM';
  } if (pallet === 'ethLLDBridge') {
    return 'LLD';
  }
  throw new Error('Unknown pallet');
};

export const getSubstrateOutgoingReceipts = async (substrate_address) => {
  const result = await getApi().post('/graphql', {
    query: receiptsQuery,
    variables: {
      orderBy: ['EVENT_ID_DESC'],
      filter: {
        fromId: {
          equalTo: substrate_address,
        },
      },
    },
  });

  const receipts = result.data.data.query.bridgeReceipts.nodes.map((r) => ({
    asset: palletToAsset(r.event.section),
    blockHash: r.event.block.hash,
    amount: r.amount,
    ethRecipient: r.ethRecipient.id,
    date: new Date(r.event.block.timestamp).getTime(),
    receipt_id: r.receiptId,
  }));

  return receipts.reduce((o, r) => ({ ...o, [r.receipt_id]: r }), {});
};

const getFilterVariable = (substrate_address) => ({
  or: [
    {
      fromId: {
        equalTo: substrate_address,
      },
    },
    {
      toId: {
        equalTo: substrate_address,
      },
    },
  ],
});

export const getHistoryTransfers = async (substrate_address) => {
  const filterVariable = getFilterVariable(substrate_address);
  const orderByVariable = ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'];
  const result = await getApi().post('/graphql', {
    query: historyTransferQuery,
    variables: {
      orderByTransfers: orderByVariable,
      filterTransfers: filterVariable,
      orderByMerits: orderByVariable,
      filterMerits: filterVariable,
      orderByAssetTransfers: orderByVariable,
      filterAssetTransfers: filterVariable,
    },
  });

  const assetsData = await getAdditionalAssets(substrate_address, true);
  const transfersAssets = result.data?.data?.assetTransfers?.nodes;
  const filteredTransferAssets = transfersAssets.filter((item) => item.asset !== '1' && item.asset !== 1);
  const transfersLLD = result.data?.data?.transfers?.nodes;
  const transfersLLM = result.data?.data?.merits?.nodes;
  const assets = filteredTransferAssets
    ? filteredTransferAssets.map((n) => {
      const newItem = {
        ...n,
        asset: assetsData[n.asset].metadata.symbol,
        decimals: assetsData[n.asset].metadata.decimals,
      };
      return newItem;
    }) : [];
  const llm = transfersLLM ? transfersLLM.map((n) => ({ asset: 'LLM', ...n })) : [];
  const lld = transfersLLD ? transfersLLD.map((n) => ({ asset: 'LLD', ...n })) : [];
  const transfers = [...assets, ...llm, ...lld];

  transfers.sort((a, b) => new BN(b.block.number).sub(new BN(a.block.number)));

  return transfers;
};

export const getUsersIdentityData = async (filterValue) => {
  const api = getApi();
  const result = await api.post('/graphql', {
    query: identitiesDataQuery,
    variables: {
      name: filterValue,
    },
  });
  const data = result?.data?.data?.identities.nodes;
  return data || null;
};
