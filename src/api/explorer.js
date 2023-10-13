import axios from 'axios';

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

const getDollarsTransfersQuery = `
  query Transfers($orderBy: [TransfersOrderBy!], $filter: TransferFilter) {
    query {
      transfers(orderBy: $orderBy, filter: $filter) {
        nodes {
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
    }
  } 
`;

const getMeritsTransfersQuery = `
  query Merits($orderBy: [MeritsOrderBy!], $filter: MeritFilter) {
    query {
      merits(orderBy: $orderBy, filter: $filter) {
        nodes {
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
    }
  }
`;

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

export const getDollarsTransfers = async (substrate_address) => {
  const result = await getApi().post('/graphql', {
    query: getDollarsTransfersQuery,
    variables: {
      orderBy: ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'],
      filter: {
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
      },
    },
  });

  const transfers = result.data?.data?.query?.transfers?.nodes;
  if (!transfers) return [];

  return transfers.map((n) => ({ asset: 'LLD', ...n }));
};

export const getMeritsTransfers = async (substrate_address) => {
  const result = await getApi().post('/graphql', {
    query: getMeritsTransfersQuery,
    variables: {
      orderBy: ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'],
      filter: {
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
      },
    },
  });

  const transfers = result.data?.data?.query?.merits?.nodes;
  if (!transfers) return [];

  return transfers.map((n) => ({ asset: 'LLM', ...n }));
};
