import { blocksToText, motionTitle, readMotion } from './motions';
import router from '../router';

/*
 * What is waiting for this citizen, right now.
 *
 * Everything the dApp asks of a person — a referendum open for their vote, a
 * motion they sit on, an election running out, a contract unsigned — lived on
 * a different screen, and nothing told them it was there. You had to go
 * looking, which means you only found it if you already knew.
 *
 * This derives that list from the store the rest of the app already fills. It
 * is deliberately pure: a task is a plain object, so both design languages
 * render the same reading and the rules can be tested without a chain.
 *
 * A task is only listed when it is genuinely this person's to do. "There are
 * open referenda" is news; "you have not voted on this one" is a task. The
 * difference is the whole point, so every provider here filters by what the
 * person has already done.
 */

/** Ordering, not decoration: what will be gone soonest comes first. */
export const URGENCY = {
  closing: 0, // decided, waiting only to be carried out
  vote: 1, // open and waiting on this person
  sign: 2, // waiting on this person, no deadline on chain
};

/* A block count below which something is worth calling out as closing. */
const SOON_BLOCKS = 14400; // one day at six seconds

const addressOf = (entry) => entry?.toString?.() ?? String(entry ?? '');

/* Chain numbers arrive as codec types; a plain number may arrive too. */
const numberOf = (value) => value?.toNumber?.() ?? (typeof value === 'number' ? value : null);

/** Has this account already voted on the motion either way? */
function hasVotedOnMotion(motion, walletAddress) {
  if (!walletAddress) return false;
  return motion.ayes.some((a) => addressOf(a) === walletAddress)
    || motion.nays.some((a) => addressOf(a) === walletAddress);
}

/**
 * Motions of one chamber that want something from a member of it.
 *
 * Two different things can be wanted, and conflating them is why the motions
 * screen used to be unreadable: a motion still open wants a vote, a motion
 * already decided wants someone to close it so it actually happens. Both are
 * only ever asked of members, so a non-member gets nothing here.
 */
export function motionTasks({
  motions, isMember, walletAddress, currentBlock, chamber,
}) {
  if (!isMember || !motions?.length) return [];
  const motionsRoute = chamber === 'senate' ? router.senate.motions : router.congress.motions;
  const house = chamber === 'senate' ? 'Senate' : 'Congress';

  return motions.reduce((tasks, raw) => {
    const motion = readMotion(raw, currentBlock);

    // Decided: the vote is over, it now needs carrying out. Any member can.
    if (motion.isClosable || motion.isClosableNaye) {
      tasks.push({
        key: `${chamber}-close-${motion.hash}`,
        kind: motion.isClosable ? 'Close & execute' : 'Close motion',
        urgency: URGENCY.closing,
        title: motion.title,
        context: `${house} motion #${motion.index}`,
        detail: motion.isClosable
          ? `${motion.ayes.length} of ${motion.threshold} ayes reached — nothing happens until it is closed`
          : 'Rejected by enough members — close it to clear the board',
        timeLeft: motion.timeLeft,
        blocksLeft: motion.blocksLeft,
        route: `${motionsRoute}/${motion.hash}`,
      });
      return tasks;
    }

    if (motion.hasExpired || hasVotedOnMotion(motion, walletAddress)) return tasks;

    tasks.push({
      key: `${chamber}-vote-${motion.hash}`,
      kind: 'Your vote',
      urgency: URGENCY.vote,
      title: motion.title,
      context: `${house} motion #${motion.index}`,
      detail: `${motion.ayes.length} aye · ${motion.nays.length} nay · ${motion.threshold} needed`,
      timeLeft: motion.timeLeft,
      blocksLeft: motion.blocksLeft,
      route: `${motionsRoute}/${motion.hash}`,
    });
    return tasks;
  }, []);
}

/**
 * Referenda this citizen has not voted on.
 *
 * Someone who has delegated their political power is not being asked: their
 * delegate votes for them, and listing it as a task would be telling them to
 * do something they have already decided not to do.
 */
export function referendumTasks({
  referendums, walletAddress, isDelegating, currentBlock,
}) {
  if (isDelegating || !referendums?.length || !walletAddress) return [];

  return referendums.reduce((tasks, referendum) => {
    const voted = [...(referendum.allAye || []), ...(referendum.allNay || [])]
      .some(({ accountId }) => addressOf(accountId) === walletAddress);
    if (voted) return tasks;

    const endBlock = numberOf(referendum.status?.end);
    const blocksLeft = endBlock != null && currentBlock != null
      ? endBlock - Number(currentBlock)
      : null;
    if (blocksLeft != null && blocksLeft <= 0) return tasks;

    const hash = referendum.imageHash?.toString?.() ?? '';
    const number = numberOf(referendum.index);
    tasks.push({
      key: `referendum-${hash || number}`,
      kind: 'Your vote',
      urgency: URGENCY.vote,
      title: motionTitle(referendum.image?.proposal),
      context: `Referendum #${numberOf(referendum.index) ?? '?'}`,
      detail: 'Open to every citizen — your merits decide it',
      timeLeft: blocksToText(blocksLeft),
      blocksLeft,
      route: hash
        ? router.voting.referendumItem.replace(':referendumHash', hash)
        : router.voting.referendum,
    });
    return tasks;
  }, []);
}

/**
 * The Congress election, if this citizen has not voted in it.
 *
 * Elections-phragmen runs on a fixed term: the count happens at every multiple
 * of the term length, so what is left of the current term is what is left to
 * vote in. A citizen who has already ranked candidates is not listed — they
 * can still change their ranking, but nothing is waiting on them.
 */
export function electionTask({
  electionsInfo, candidates, myVotes, currentBlock,
}) {
  const termDuration = numberOf(electionsInfo?.termDuration);
  if (!termDuration || currentBlock == null) return [];
  if (myVotes?.length) return [];
  if (!candidates?.length) return [];

  const blocksLeft = termDuration - (Number(currentBlock) % termDuration);
  return [{
    key: 'congress-election',
    kind: 'Your vote',
    urgency: URGENCY.vote,
    title: 'Congress election',
    context: `${candidates.length} candidate${candidates.length === 1 ? '' : 's'} standing`,
    detail: 'You have not ranked any candidates for this term',
    timeLeft: blocksToText(blocksLeft),
    blocksLeft,
    route: router.voting.candidates,
  }];
}

/**
 * Contracts this citizen is a party to and has not signed.
 *
 * The chain records each party's signature separately, so a contract is
 * waiting on exactly the parties missing from that list.
 */
export function contractTasks({ myContracts, walletAddress }) {
  if (!myContracts?.length || !walletAddress) return [];

  return myContracts.reduce((tasks, contract) => {
    const isParty = (contract.parties || []).includes(walletAddress);
    const hasSigned = (contract.partiesSignaturesList || []).includes(walletAddress);
    if (!isParty || hasSigned) return tasks;

    const missing = (contract.parties || []).length - (contract.partiesSignaturesList || []).length;
    tasks.push({
      key: `contract-${contract.contractId}`,
      kind: 'Your signature',
      urgency: URGENCY.sign,
      title: `Contract #${contract.contractId}`,
      context: 'You are a party to it',
      detail: missing > 1
        ? `${missing} parties have still to sign`
        : 'Yours is the last signature it needs',
      timeLeft: null,
      blocksLeft: null,
      route: router.contracts.item.replace(':id', contract.contractId),
    });
    return tasks;
  }, []);
}

/**
 * One list, in the order a person should deal with it: what needs carrying
 * out, then what is closing soonest, then everything else.
 */
export function sortTasks(tasks) {
  return [...(tasks || [])].sort((a, b) => {
    if (a.urgency !== b.urgency) return a.urgency - b.urgency;
    // A deadline beats no deadline; the nearer deadline beats the further.
    if (a.blocksLeft == null && b.blocksLeft == null) return 0;
    if (a.blocksLeft == null) return 1;
    if (b.blocksLeft == null) return -1;
    return a.blocksLeft - b.blocksLeft;
  });
}

/** The deadline, as a person reads it. Null when the task has none. */
export function deadlineText(task) {
  if (task?.blocksLeft == null) return null;
  if (task.blocksLeft <= 0) return 'Time is up';
  return `${blocksToText(task.blocksLeft)} left`;
}

/** True when a task is close enough to its deadline to be worth marking. */
export function isClosingSoon(task) {
  return task.blocksLeft != null && task.blocksLeft > 0 && task.blocksLeft <= SOON_BLOCKS;
}
