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
 * What happens to this motion if it passes.
 *
 * Several council motions do not take effect themselves — they start a public
 * referendum, and the real decision happens there. A member voting on one is
 * deciding whether to put the question to the citizens, which is a different
 * question from whether they agree with it, so the screen says which it is.
 */
export function describeFate(call) {
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
