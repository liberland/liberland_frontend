import { intervalToDuration } from 'date-fns';
import {
  isAddLegislation,
  isAmendLegislation,
  isBlacklist,
  isCouncilSenateExecute,
  isExternalProposeMajority,
  isFastTrackProposal,
  isRemark,
  isRepealLegislation,
  isRepealLegislationSection,
  isScheduler,
  isTransferAssets,
  isTransferLLD,
  isTransferLLM,
} from '../components/Proposal/predicates';
import { blockDurationMilis } from '../components/Congress/MotionCountDown/constants';
import { formatDollars, formatMerits } from './walletHelpers';
import { tryParseMaybeHexFromHuman } from './legislation';

/*
 * One reading of a council or senate motion, shared by both design languages.
 *
 * The chain gives a motion as three separate pieces — the proposal hash, the
 * call it carries, and the tally — and says nothing about whether it has been
 * decided, when it runs out, or what passing it would actually do. Deriving
 * all of that in one place is what lets the two languages, the list and the
 * detail view agree: a motion cannot read "passing" on one screen and
 * "voting" on another.
 */

export const MOTION_STATUS = {
  passing: {
    key: 'passing',
    label: 'Passing',
    hint: 'Enough ayes to close and execute',
  },
  rejecting: {
    key: 'rejecting',
    label: 'Rejected',
    hint: 'Enough nays that the threshold can no longer be met',
  },
  voting: {
    key: 'voting',
    label: 'Voting',
    hint: 'Still open, neither side decisive',
  },
  expired: {
    key: 'expired',
    label: 'Expired',
    hint: 'The voting period ended without a decision',
  },
};

/** Order the filter chips are offered in; `all` first so nothing is hidden by default. */
export const MOTION_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'voting', label: 'Voting' },
  { key: 'passing', label: 'Passing' },
  { key: 'rejecting', label: 'Rejected' },
  { key: 'expired', label: 'Expired' },
];

/**
 * Peel the procedural wrappers off a call to reach what is actually proposed.
 *
 * A motion is often a wrapper around its real subject: the chamber executing
 * from its own account, a scheduled call, a batch of one. Those say how a
 * decision is carried out, not what is being decided — and naming a motion
 * after its wrapper gives every such motion the same title. The wrappers are
 * still reported, in the motion's fate; the subject comes from in here.
 *
 * Returns the innermost call and the wrappers removed, outermost first.
 */
export function unwrapCall(call, depth = 0) {
  if (!call || depth > 6) return { call, wrappers: [] };
  const descend = (inner, label) => {
    if (!inner) return { call, wrappers: [] };
    const next = unwrapCall(inner, depth + 1);
    return { call: next.call, wrappers: [label, ...next.wrappers] };
  };
  try {
    if (call.method === 'execute' && (call.section === 'councilAccount' || call.section === 'senateAccount')) {
      return descend(call.args?.[0], call.section === 'councilAccount' ? 'Congress account' : 'Senate account');
    }
    if (call.method === 'schedule' && call.section === 'scheduler') {
      return descend(call.args?.[3], 'scheduler');
    }
    if ((call.method === 'batchAll' || call.method === 'batch') && call.args?.[0]?.length === 1) {
      return descend(call.args[0][0], 'batch');
    }
  } catch (_) {
    // An unfamiliar wrapper shape is simply left alone.
  }
  return { call, wrappers: [] };
}

/**
 * What happens to this motion if it passes.
 *
 * Several council motions do not take effect themselves — they start a public
 * referendum, and the real decision happens there. A member voting on one is
 * deciding whether to put the question to the citizens, which is a different
 * question from whether they agree with it, so the screen says which it is.
 */
function describeEffect(call) {
  if (!call) return { label: 'Unknown', detail: 'The proposal could not be read.' };

  // Each predicate is asked separately: an unfamiliar call shape must not stop
  // the later questions from being asked. Wrapping the whole chain in one
  // try/catch meant a throw in the first test silently fell through to
  // "direct execution" for every proposal after it.
  const is = (predicate) => {
    try {
      return predicate(call);
    } catch (_) {
      return false;
    }
  };

  if (is(isFastTrackProposal)) {
    return {
      label: 'Fast-tracked referendum',
      detail: 'If it passes, this goes straight to a public referendum on a shortened '
        + 'timetable. Citizens cast the deciding vote, not Congress.',
    };
  }
  if (is(isExternalProposeMajority)) {
    return {
      label: 'Public referendum',
      detail: 'If it passes, this becomes a public referendum decided by simple majority. '
        + 'Congress is deciding whether to put the question, not settling it.',
    };
  }
  if (is(isBlacklist)) {
    return {
      label: 'Blacklist',
      detail: 'If it passes, the named proposal is blocked and any referendum on it is cancelled.',
    };
  }
  if (is(isAddLegislation)) {
    return { label: 'Enacts legislation', detail: 'If it passes, the legislation is written to chain immediately.' };
  }
  if (is(isAmendLegislation)) {
    return { label: 'Amends legislation', detail: 'If it passes, the existing legislation is amended immediately.' };
  }
  if (is(isRepealLegislation) || is(isRepealLegislationSection)) {
    return { label: 'Repeals legislation', detail: 'If it passes, the legislation is repealed immediately.' };
  }
  if (is(isScheduler)) {
    return {
      label: 'Scheduled action',
      detail: 'If it passes, the call is scheduled to run at a future block rather than at once.',
    };
  }
  if (is(isTransferLLD)) {
    return { label: 'Pays out LLD', detail: 'If it passes, the transfer is made immediately.' };
  }
  if (is(isTransferLLM)) {
    return { label: 'Pays out LLM', detail: 'If it passes, the transfer is made immediately.' };
  }
  if (is(isTransferAssets)) {
    return { label: 'Transfers an asset', detail: 'If it passes, the transfer is made immediately.' };
  }
  if (is(isCouncilSenateExecute)) {
    return {
      label: 'Executes from the treasury account',
      detail: 'If it passes, the inner call runs with the chamber’s own account as the origin.',
    };
  }
  if (is(isRemark)) {
    return { label: 'On-chain remark', detail: 'If it passes, a remark is recorded. Nothing else changes.' };
  }

  const section = call.section ? `${call.section}.` : '';
  return {
    label: 'Direct execution',
    detail: `If it passes, ${section}${call.method || 'the call'} runs immediately.`,
  };
}

/**
 * What happens if the motion passes, read from what it actually does.
 *
 * The effect is the innermost call's; the wrappers only say through which
 * account, or when, so they become a clause rather than the whole answer. A
 * motion that reads "Congress executes" says nothing about whether it enacts a
 * law or pays an invoice.
 */
export function describeFate(outerCall) {
  if (!outerCall) return { label: 'Unknown', detail: 'The proposal could not be read.' };
  const { call, wrappers } = unwrapCall(outerCall);
  const effect = describeEffect(call);
  if (!wrappers.length) return effect;
  return {
    ...effect,
    detail: `${effect.detail} Carried out through the ${wrappers.join(', then the ')}.`,
  };
}

/** The first markdown heading of a legislation section, if it has one. */
function headingOf(section) {
  const text = tryParseMaybeHexFromHuman(section);
  if (!text) return null;
  const line = text.split('\n').map((l) => l.trim()).find((l) => l.startsWith('#'));
  if (!line) return null;
  const heading = line.replace(/^#+\s*/, '').trim();
  return heading || null;
}

const legislationRef = (call) => {
  const tier = call.args[0].toString();
  const { year, index } = call.args[1];
  return `${tier} ${year.toNumber()}/${index.toNumber()}`;
};

const shortHash = (h) => {
  const s = h?.toString?.() ?? String(h ?? '');
  return s.length > 14 ? `${s.slice(0, 10)}…${s.slice(-4)}` : s;
};

/**
 * What the motion is about, in one line.
 *
 * The subject of a vote used to be buried inside the expanded body, so a list
 * of motions read as a list of identical cards. Every branch is guarded: an
 * argument shape this was not written for falls back to naming the call rather
 * than throwing, because a wrong title is recoverable and a blank screen is
 * not.
 */
export function motionTitle(outerCall) {
  if (!outerCall) return 'Unreadable proposal';
  // The subject is the innermost call. "Congress executes…" and "Scheduled…"
  // describe the procedure, and would otherwise be the title of every motion
  // that uses one, hiding the act being voted on behind the machinery.
  const { call } = unwrapCall(outerCall);
  const at = (fn, fallback) => {
    try {
      const out = fn();
      return out || fallback;
    } catch (_) {
      return fallback;
    }
  };
  // A call we cannot name is still named something a person can read; "?.?"
  // is worse than saying plainly that it has no name we know.
  const named = call.section && call.method ? `${call.section}.${call.method}` : 'Unnamed call';

  switch (call.method) {
    case 'addLegislation':
      return at(() => {
        const heading = headingOf(call.args[2]?.[0]);
        return heading ? `${heading} — new ${legislationRef(call)}` : `New legislation ${legislationRef(call)}`;
      }, 'New legislation');
    case 'amendLegislation':
      return at(() => {
        const heading = headingOf(call.args[3]);
        const ref = `${legislationRef(call)} § ${call.args[2].toNumber()}`;
        return heading ? `${heading} — amends ${ref}` : `Amend ${ref}`;
      }, 'Amend legislation');
    case 'repealLegislation':
      return at(() => `Repeal ${legislationRef(call)}`, 'Repeal legislation');
    case 'repealLegislationSection':
      return at(() => `Repeal ${legislationRef(call)} § ${call.args[2].toNumber()}`, 'Repeal a legislation section');
    case 'transfer':
      if (call.section === 'balances') {
        return at(() => `Transfer ${formatDollars(call.args[1])} LLD`, 'Transfer LLD');
      }
      if (call.section === 'assets') {
        return at(() => `Transfer asset #${call.args[0].toString()}`, 'Transfer an asset');
      }
      return named;
    case 'sendLlmToPolitipool':
      return at(() => `Politipool ${formatMerits(call.args[1])} LLM`, 'Politipool LLM');
    case 'sendLlm':
      return at(() => `Send ${formatMerits(call.args[1])} LLM`, 'Send LLM');
    case 'remark':
      return 'Treasury remark';
    case 'blacklist':
      return at(() => `Blacklist proposal ${shortHash(call.args[0])}`, 'Blacklist a proposal');
    case 'externalProposeMajority':
      return at(() => `Put ${shortHash(call.args[0].asLookup.hash_)} to referendum`, 'Put a question to referendum');
    // Reached only when unwrapCall could not see inside — an empty or
    // unfamiliar wrapper. Naming the machinery is then all there is.
    case 'schedule':
      return 'Scheduled call';
    case 'execute':
      if (call.section === 'councilAccount') return 'Call from the Congress account';
      if (call.section === 'senateAccount') return 'Call from the Senate account';
      return named;
    case 'batchAll':
    case 'batch':
      // A batch of one is already unwrapped. For several, lead with the first
      // subject and say how many follow, rather than only counting them.
      return at(() => {
        const calls = call.args[0];
        const rest = calls.length - 1;
        return `${motionTitle(calls[0])} + ${rest} more`;
      }, 'Batch of calls');
    case 'setMembers':
      return 'Set the chamber’s members';
    default:
      return named;
  }
}

/** Human time for a span of blocks, at the chain's six-second block. */
export function blocksToText(blocks) {
  if (blocks == null || Number.isNaN(blocks)) return null;
  if (blocks <= 0) return 'ended';
  const ms = blocks * blockDurationMilis;
  const { days, hours, minutes } = intervalToDuration({ start: 0, end: ms });
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (!days && minutes) parts.push(`${minutes}m`);
  return parts.length ? parts.join(' ') : 'under a minute';
}

/**
 * Read one motion into everything the screens need.
 *
 * `voting.index` is the chain's own sequence number for the motion, which is
 * the only reliable way to order them — `council.proposals()` returns hashes
 * in storage order, which is neither chronological nor stable.
 */
export function readMotion(motion, currentBlock) {
  const { proposal, proposalOf, voting } = motion;
  const unwrappedCall = proposalOf?.unwrap ? proposalOf.unwrap() : proposalOf;
  const tally = voting?.unwrap ? voting.unwrap() : voting;

  const hash = proposal?.toString?.() ?? String(proposal ?? '');
  const ayes = tally?.ayes ?? [];
  const nays = tally?.nays ?? [];
  const threshold = tally?.threshold?.toNumber?.() ?? 0;
  const seats = motion.membersCount ?? 0;
  const index = tally?.index?.toNumber?.() ?? 0;
  const endBlock = tally?.end?.toNumber?.() ?? null;

  const isClosable = ayes.length >= threshold;
  const isClosableNaye = nays.length > seats - threshold;
  const blocksLeft = endBlock != null && currentBlock != null ? endBlock - Number(currentBlock) : null;
  const hasExpired = blocksLeft != null && blocksLeft <= 0;

  let status = MOTION_STATUS.voting;
  if (isClosable) status = MOTION_STATUS.passing;
  else if (isClosableNaye) status = MOTION_STATUS.rejecting;
  else if (hasExpired) status = MOTION_STATUS.expired;

  return {
    raw: motion,
    call: unwrappedCall,
    tally,
    hash,
    index,
    ayes,
    nays,
    threshold,
    seats,
    endBlock,
    blocksLeft,
    timeLeft: blocksToText(blocksLeft),
    hasExpired,
    isClosable,
    isClosableNaye,
    status,
    title: motionTitle(unwrappedCall),
    fate: describeFate(unwrappedCall),
  };
}

/** Newest first. The chain's own index is the sequence; storage order is not. */
export function sortMotionsNewestFirst(motions, currentBlock) {
  return (motions || [])
    .map((motion) => readMotion(motion, currentBlock))
    .sort((a, b) => b.index - a.index);
}

export function countByStatus(readMotions) {
  return (readMotions || []).reduce((acc, m) => {
    acc[m.status.key] = (acc[m.status.key] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {});
}
