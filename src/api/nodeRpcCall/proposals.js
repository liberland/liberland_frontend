import { IndexHelper } from '../../utils/council/councilEnum';
import { OfficeType } from '../../utils/officeTypeEnum';
import { getApi, submitExtrinsic } from './core';

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

export {
  congressMajorityThreshold,
  createProposalAndVote,
  handleCreateProposalAndVote,
  createSenateProposalAndVote,
  senateMajorityThreshold,
  getClerksMinistryFinance,
  congressSenateSendLlm,
  congressSenateSendLld,
  congressSenateSendLlmToPolitipool,
  congressSenateSendAssets,
  congressProposeBudget,
  senateVoteAtMotions,
};
