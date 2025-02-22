import useTransferAsset from './hooks/useTransferAsset';
import useTransferLLD from './hooks/useTransferLLD';
import useTransferLLM from './hooks/useTransferLLM';

function isFastTrackProposal(proposal) {
  function fastTrackMatches(prop, fastTrack) {
    const fastTrackHash = fastTrack.args[0];
    const p = prop.args[0];
    if (p.isLookup) return p.asLookup.hash_.eq(fastTrackHash);

    // our FE only uses Lookup
    return false;
  }
  const { args: [calls] } = proposal;
  return calls.length === 2
    && calls[0].section === 'democracy'
    && calls[0].method === 'externalPropose'
    && calls[1].section === 'democracy'
    && calls[1].method === 'fastTrack'
    && fastTrackMatches(calls[0], calls[1]);
}

function isRepealLegislation(proposal) {
  return proposal.method === 'repealLegislation';
}

function isRepealLegislationSection(proposal) {
  return proposal.method === 'repealLegislationSection';
}

function isAmendLegislation(proposal) {
  return proposal.method === 'amendLegislation';
}

function isAddLegislation(proposal) {
  return proposal.method === 'addLegislation';
}

function isBatchAll(proposal) {
  return proposal.method === 'batchAll';
}

function isExternalProposeMajority(proposal) {
  return proposal.method === 'externalProposeMajority';
}

function isBlacklist(proposal) {
  return proposal.method === 'blacklist' && proposal.section === 'democracy';
}

function isCouncilSenateExecute(proposal) {
  return proposal.method === 'execute'
    && (proposal.section === 'councilAccount' || proposal.section === 'senateAccount');
}

function isScheduler(proposal) {
  return proposal.method === 'schedule' && proposal.section === 'scheduler';
}

function isTransferLLD(proposal) {
  return proposal.method === 'transfer' && proposal.section === 'balances';
}

function isTransferLLM(proposal) {
  return (proposal.method === 'sendLlmToPolitipool' || proposal.method === 'sendLlm') && proposal.section === 'llm';
}

function isTransferAssets(proposal) {
  return proposal.method === 'transfer' && proposal.section === 'assets';
}

function isRemark(proposal) {
  return proposal.method === 'remark' && proposal.section === 'llm';
}

function isTransfer(proposal) {
  return isTransferAssets(proposal) || isTransferLLD(proposal) || isTransferLLM(proposal);
}

function getTransferHook(proposal) {
  if (isTransferLLD(proposal)) {
    return useTransferLLD;
  }
  if (isTransferLLM(proposal)) {
    return useTransferLLM;
  }
  return useTransferAsset;
}

export {
  isRepealLegislation,
  isFastTrackProposal,
  isAddLegislation,
  isAmendLegislation,
  isBatchAll,
  isBlacklist,
  isCouncilSenateExecute,
  isExternalProposeMajority,
  isRemark,
  isRepealLegislationSection,
  isScheduler,
  isTransfer,
  isTransferAssets,
  isTransferLLD,
  isTransferLLM,
  getTransferHook,
};
