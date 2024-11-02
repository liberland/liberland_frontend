/* eslint-disable no-param-reassign */
function groupProposals(proposals, toHuman) {
  return proposals.reduce((grouped, proposal) => {
    const {
      method,
      section,
    } = toHuman(proposal);

    grouped[method] ||= {};
    grouped[method][section] ||= [];
    grouped[method][section].push(proposal);
    return grouped;
  }, {});
}

function isTableReady(proposal) {
  const {
    method,
    section,
  } = proposal.proposal.toHuman();

  if (method === 'transfer' && section === 'balances') {
    return true;
  }
  if ((method === 'sendLlmToPolitipool' || method === 'sendLlm') && section === 'llm') {
    return true;
  }
  if (method === 'transfer' && section === 'assets') {
    return true;
  }
  if (method === 'remark' && section === 'llm') {
    return true;
  }
  return false;
}

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

function unBatchProposals(proposals, toHuman) {
  return proposals.reduce((unbatched, proposal) => {
    const {
      method,
    } = toHuman(proposal);
    if (method === 'batchAll' && !isFastTrackProposal(proposal.proposal)) {
      const { args: [calls] } = proposal.proposal;
      unbatched.push(...calls.map((call) => ({
        ...proposal,
        proposal: call,
      })));
    } else {
      unbatched.push(proposal);
    }
    return unbatched;
  }, []);
}

function proposalHeading(proposal) {
  const {
    method,
    section,
  } = proposal.proposal.toHuman();

  if (method === 'repealLegislation') {
    return 'Repeal legislation';
  } if (method === 'repealLegislationSection') {
    return 'Repeal legislation section';
  } if (method === 'amendLegislation') {
    return 'Amend legislation';
  } if (method === 'addLegislation') {
    return 'Add legislation';
  } if (method === 'batchAll') {
    return 'Batch';
  } if (method === 'externalProposeMajority') {
    return 'Propose majority';
  } if (method === 'blacklist' && section === 'democracy') {
    return 'Blacklist';
  } if (method === 'execute' && (section === 'councilAccount' || section === 'senateAccount')) {
    return 'Execute';
  } if (method === 'schedule' && section === 'scheduler') {
    return 'Schedule';
  } if (method === 'transfer' && section === 'balances') {
    return 'Transfer LLD';
  } if ((method === 'sendLlmToPolitipool' || method === 'sendLlm') && section === 'llm') {
    return 'Transfer LLM';
  } if (method === 'transfer' && section === 'assets') {
    return 'Transfer assets';
  } if (method === 'remark' && section === 'llm') {
    return 'Remark';
  }

  return 'Raw';
}

export {
  groupProposals,
  isTableReady,
  proposalHeading,
  unBatchProposals,
  isFastTrackProposal,
};
