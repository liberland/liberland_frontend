import { web3FromAddress } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import pako from 'pako';
import { blockchainDataToFormObject } from '../../utils/nodeRpcCall';
import { decodeAndFilter } from '../../utils/identityParser';
import { getApi, submitExtrinsic } from './core';

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

  const metaverseLandForOwner = [];
  const landForOwner = [];

  const landForOwnerIds = [];
  const landMetadataQueries = [];
  const metaverseLandForOwnerIds = [];
  const metaverseLandMetadataQueries = [];

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

export {
  getCongressMembersWithIdentity,
  voteForCongress,
  castVetoForLegislation,
  revertVetoForLegislation,
  getLegislation,
  getOfficialUserRegistryEntries,
  requestCompanyRegistration,
  requestEditCompanyRegistration,
  getCitizenCount,
  getLandNFTMetadataJson,
  setLandNFTMetadata,
  getBlockEvents,
  getVotesList,
  getMotions,
  getCongressCandidates,
  getCongressMembers,
  getRunnersUp,
  renounceCandidacy,
  applyForCongress,
  voteAtMotions,
};
