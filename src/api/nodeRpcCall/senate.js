import { getVotesList } from './congress';
import { getApi, submitExtrinsic } from './core';
import { createSenateProposalAndVote, senateMajorityThreshold } from './proposals';
import { getScheduledCalls } from './scheduler';

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

export {
  getStakingData,
  getSenateMotions,
  matchScheduledWithSenateMotions,
  getSenateMembers,
  senateProposeCancel,
  closeSenateMotion,
};
