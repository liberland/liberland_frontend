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

function proposalHeading(type) {
  if (type === 'transferLLD') {
    return 'Transfer LLD';
  } if (type === 'transferLLM') {
    return 'Transfer LLM';
  } if (type === 'transferAsset') {
    return 'Transfer assets';
  } if (type === 'remarks') {
    return 'Remarks';
  }

  return '';
}

function proposalTableHeadings(type) {
  if (type === 'transferLLD' || type === 'transferLLM' || type === 'transferAsset') {
    return {
      headings: [
        'Transfer',
        'To',
      ],
      small: true,
    };
  }
  if (type === 'remarks') {
    return {
      headings: [
        'Category',
        'Project',
        'Supplier',
        'Description',
        'Currency',
        'Amount in USD',
        'Final Destination',
        'Date',
      ],
      small: false,
    };
  }
  // eslint-disable-next-line no-console
  console.warn(`Trying to display proposal ${type} as table. Unsupported`);
  return { headings: [], small: true };
}

export {
  groupProposals,
  isTableReady,
  proposalHeading,
  proposalTableHeadings,
  isFastTrackProposal,
};
