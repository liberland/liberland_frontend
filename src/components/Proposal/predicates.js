/*
 * What kind of call a proposal carries.
 *
 * Kept apart from utils.js because these are pure functions over a decoded
 * call, while utils.js also reaches for React hooks and the components that
 * render them. Anything that only needs to ask "what is this?" — the motions
 * model, for one — can import this without pulling the rendering layer in.
 */

function isFastTrackProposal(proposal) {
  function fastTrackMatches(prop, fastTrack) {
    const fastTrackHash = fastTrack.args?.[0];
    const p = prop.args?.[0];
    if (p?.isLookup) return p.asLookup.hash_.eq(fastTrackHash);

    // our FE only uses Lookup
    return false;
  }
  // Only a batch has a list of calls here. A call with no arguments at all —
  // and there are several — used to throw on `calls.length`, which took down
  // whatever was asking.
  const calls = proposal?.args?.[0];
  if (!calls || typeof calls.length !== 'number' || calls.length !== 2) return false;
  return calls[0]?.section === 'democracy'
    && calls[0]?.method === 'externalPropose'
    && calls[1]?.section === 'democracy'
    && calls[1]?.method === 'fastTrack'
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

export {
  isFastTrackProposal,
  isRepealLegislation,
  isRepealLegislationSection,
  isAmendLegislation,
  isAddLegislation,
  isBatchAll,
  isExternalProposeMajority,
  isBlacklist,
  isCouncilSenateExecute,
  isScheduler,
  isTransferLLD,
  isTransferLLM,
  isTransferAssets,
  isRemark,
  isTransfer,
};
