import * as centralizedBackend from '../backend';
import { getApi, submitExtrinsic } from './core';
import { congressMajorityThreshold, createProposalAndVote, handleCreateProposalAndVote } from './proposals';

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

  await centralizedBackend.tryAddReferendum({
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

  await centralizedBackend.tryAddReferendum({
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
  await centralizedBackend.tryAddReferendum({
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
      hash_: proposal.hash,
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

export {
  congressProposeLegislation,
  congressRepealLegislation,
  getTreasurySpendProposals,
  getTreasurySpendPeriod,
  getTreasuryBudget,
  congressApproveTreasurySpend,
  congressUnapproveTreasurySpend,
  closeCongressMotion,
  congressProposeLegislationViaReferendum,
  congressProposeRepealLegislation,
  citizenProposeRepealLegislation,
  congressSendTreasuryLld,
  getPalletIds,
  congressDemocracyBlacklist,
  proposeAmendLegislation,
  congressAmendLegislation,
  congressAmendLegislationViaReferendum,
};
