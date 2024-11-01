/* eslint-disable no-param-reassign */
function groupProposals(proposals) {
  return proposals.reduce((grouped, proposal) => {
    const proposalMethod = proposal.method || 'raw';
    const proposalSection = proposal.section || 'raw';
    grouped[proposalMethod] ||= {};
    grouped[proposalMethod][proposalSection] ||= [];
    grouped[proposalMethod][proposalSection].push(proposal);
    return grouped;
  }, {});
}

function isTableReady(proposal) {
  const proposalMethod = proposal.method || 'raw';
  const proposalSection = proposal.section || 'raw';

  if (proposalMethod === 'transfer' && proposalSection === 'balances') {
    return true;
  }
  if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
    return true;
  }
  if (proposalMethod === 'transfer' && proposalSection === 'assets') {
    return true;
  }
  if (proposalMethod === 'remark' && proposalSection === 'llm') {
    return true;
  }
  return false;
}

function proposalHeading(proposal) {
  const proposalMethod = proposal.method || 'raw';
  const proposalSection = proposal.section || 'raw';

  if (proposalMethod === 'repealLegislation') {
    return 'Repeal legislation';
  } if (proposalMethod === 'repealLegislationSection') {
    return 'Repeal legislation section';
  } if (proposalMethod === 'amendLegislation') {
    return 'Amend legislation';
  } if (proposalMethod === 'addLegislation') {
    return 'Add legislation';
  } if (proposalMethod === 'batchAll') {
    return 'Batch';
  } if (proposalMethod === 'externalProposeMajority') {
    return 'Propose majority';
  } if (proposalMethod === 'blacklist' && proposalSection === 'democracy') {
    return 'Blacklist';
  } if (proposalMethod === 'execute' && (proposalSection === 'councilAccount' || proposalSection === 'senateAccount')) {
    return 'Execute';
  } if (proposalMethod === 'schedule' && proposalSection === 'scheduler') {
    return 'Schedule';
  } if (proposalMethod === 'transfer' && proposalSection === 'balances') {
    return 'Transfer LLD';
  } if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
    return 'Transfer LLM';
  } if (proposalMethod === 'transfer' && proposalSection === 'assets') {
    return 'Transfer assets';
  } if (proposalMethod === 'remark' && proposalSection === 'llm') {
    return 'Remark';
  }

  return 'Raw';
}

export default {
  groupProposals,
  isTableReady,
  proposalHeading,
};
