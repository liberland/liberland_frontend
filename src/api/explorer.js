import axios from 'axios';
import { BN } from '@polkadot/util';
import { getAdditionalAssets } from './nodeRpcCall';

const historyTransferQuery = `
  query CombinedQuery(
    $orderByTransfers: [TransfersOrderBy!],
    $filterTransfers: TransferFilter,
    $orderByMerits: [MeritsOrderBy!],
    $filterMerits: MeritFilter,
    $orderByAssetTransfers: [AssetTransfersOrderBy!],
    $filterAssetTransfers: AssetTransferFilter,
    $orderByStakings: [StakingsOrderBy!],
    $filterStakings: StakingFilter,
    $filterSoraMinted: SoraMintedFilter,
    $filterSoraBurned: SoraBurnedFilter,
  
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

    stakings(orderBy: $orderByStakings, filter: $filterStakings) {
      nodes {
        type: __typename
        isPositive
        userId
        value
        blockId
        blockNumber
        extrinsicIndex
        method
        block {
          id
          number
          timestamp
        }
      }
    }

    soraMinteds(
      filter: $filterSoraMinted
    ) {
      nodes {
        id
        sender
        recipientId
        value
        asset
        block {
            id,
            number,
            timestamp,
        }
        extrinsicIndex
      }
    }

    soraBurneds(
      filter: $filterSoraBurned
    ) {
      nodes {
        id
        senderId
        recipient
        value
        asset
        block {
            id,
            number,
            timestamp,
        }
        extrinsicIndex
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

function getStakingActionText(method) {
  switch (method) {
    case 'Rewarded':
      return 'staking reward';
    case 'Withdrawn':
      return 'staking payout';
    case 'Bonded':
      return 'staking payment';
    case 'Slashed':
      return 'staking slash';
    default:
      return 'staking action';
  }
}

const getFilterVariable = (substrateAddress) => ({
  or: [
    {
      fromId: {
        equalTo: substrateAddress,
      },
    },
    {
      toId: {
        equalTo: substrateAddress,
      },
    },
  ],
});

const getFilterForStaking = (substrateAddress) => ({
  userId: {
    equalTo: substrateAddress,
  },
});

const getFilterSoraMinted = (substrateAddress) => ({
  recipientId: {
    equalTo: substrateAddress,
  },
});

const getFilterSoraBurned = (substrateAddress) => ({
  senderId: {
    equalTo: substrateAddress,
  },
});

const getWalletTransfers = async (substrateAddress) => {
  const filterVariable = getFilterVariable(substrateAddress);
  const stakingsFilter = getFilterForStaking(substrateAddress);
  const filterSoraMinted = getFilterSoraMinted(substrateAddress);
  const filterSoraBurned = getFilterSoraBurned(substrateAddress);

  const orderByVariable = ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'];
  const { data } = await getApi().post('/graphql', {
    query: historyTransferQuery,
    variables: {
      orderByTransfers: orderByVariable,
      filterTransfers: filterVariable,
      orderByMerits: orderByVariable,
      filterMerits: filterVariable,
      orderByAssetTransfers: orderByVariable,
      filterAssetTransfers: filterVariable,
      filterStakings: stakingsFilter,
      orderByStakings: orderByVariable,
      filterSoraMinted,
      filterSoraBurned,
    },
  });
  return data;
};

const parseSoraTransfer = (soraMinted, soraBurned, assetsData) => {
  const soraBridgeName = 'Sora Bridge';
  const soraMintedParsed = soraMinted.map(({
    asset, block, recipientId, value,
  }) => {
    const parsedAsset = JSON.parse(asset);
    const isLLD = Object.keys(parsedAsset)[0] === 'lld' && parsedAsset.lld === null;

    return {
      asset: isLLD ? 'LLD' : assetsData[parsedAsset.asset].metadata.symbol,
      decimals: isLLD ? null : assetsData[parsedAsset.asset].metadata.decimals,
      fromId: soraBridgeName,
      toId: recipientId,
      value,
      block,
    };
  });

  const soraBurnedParsed = soraBurned.map(({
    asset, block, senderId, value,
  }) => {
    const parsedAsset = JSON.parse(asset);
    const isLLD = Object.keys(parsedAsset)[0] === 'lld' && parsedAsset.lld === null;

    return {
      asset: isLLD ? 'LLD' : assetsData[parsedAsset.asset].metadata.symbol,
      decimals: isLLD ? null : assetsData[parsedAsset.asset].metadata.decimals,
      fromId: senderId,
      toId: soraBridgeName,
      value,
      block,
    };
  });

  return [...soraMintedParsed, ...soraBurnedParsed];
};

export const getHistoryTransfers = async (substrateAddress) => {
  const [
    transferData,
    assetsData,
  ] = await Promise.all([
    getWalletTransfers(substrateAddress),
    getAdditionalAssets(substrateAddress, true),
  ]);

  const soraMinted = transferData.data?.soraMinteds?.nodes ?? [];
  const soraBurned = transferData.data?.soraBurneds?.nodes ?? [];
  const stakingsData = transferData.data?.stakings?.nodes ?? [];
  const transfersAssets = transferData.data?.assetTransfers?.nodes ?? [];
  const transfersLLD = transferData.data?.transfers?.nodes ?? [];
  const transfersLLM = transferData.data?.merits?.nodes ?? [];

  const filteredTransferAssets = transfersAssets.filter((item) => item.asset !== '1' && item.asset !== 1);
  const parsedSoraTransfers = parseSoraTransfer(soraMinted, soraBurned, assetsData);

  const assets = filteredTransferAssets.map((n) => ({
    ...n,
    asset: assetsData[n.asset].metadata.symbol,
    decimals: assetsData[n.asset].metadata.decimals,
  }));
  const llm = transfersLLM.map((n) => ({ asset: 'LLM', ...n }));
  const lld = transfersLLD.map((n) => ({ asset: 'LLD', ...n }));
  const stakings = stakingsData.map((n) => ({ asset: 'LLD', stakingActionText: getStakingActionText(n.method), ...n }));
  const transfers = [...assets, ...llm, ...lld, ...stakings, ...parsedSoraTransfers];

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
