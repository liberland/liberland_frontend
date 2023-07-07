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

const getApi = () => {
    return axios.create({
        baseURL: process.env.REACT_APP_EXPLORER,
    });
}

const palletToAsset = (pallet) => {
    if (pallet == "ethLLMBridge") {
        return "LLM";
    } else if (pallet == "ethLLDBridge") {
        return "LLD";
    } else {
        throw new Error("Unknown pallet");
    }
}

export const getSubstrateOutgoingReceipts = async (substrate_address) => {
    let result = await getApi().post('/graphql', {
        query: receiptsQuery,
        variables: {
            orderBy: ['EVENT_ID_DESC'],
            filter: {
                fromId: {
                    equalTo: substrate_address
                }
            }
        }
    });

    const receipts = result.data.data.query.bridgeReceipts.nodes.map(r => ({
        asset: palletToAsset(r.event.section),
        blockHash: r.event.block.hash,
        amount: r.amount,
        ethRecipient: r.ethRecipient.id,
        date: new Date(r.event.block.timestamp).getTime(),
        receipt_id: r.receiptId,
    }));

    const res = {
        LLM: receipts.filter(r => r.asset === "LLM").reduce((o, r) => {
            o[r.receipt_id] = r;
            return o;
        }, {}),
        LLD: receipts.filter(r => r.asset === "LLD").reduce((o, r) => {
            o[r.receipt_id] = r;
            return o;
        }, {})
    };

    return res;
}