import * as centralizedBackend from '../backend';
import { crossReference, getApi, submitExtrinsic } from './core';

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
  await centralizedBackend.tryAddReferendum({
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
      hash_: hash,
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

export {
  delegateDemocracy,
  undelegateDemocracy,
  getDemocracyReferendums,
  voteOnReferendum,
  submitProposal,
};
