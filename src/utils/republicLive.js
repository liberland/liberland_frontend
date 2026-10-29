import { blocksToText, motionTitle } from './motions';
import { formatAssets, formatCustom, formatDollars } from './walletHelpers';

/*
 * The republic, as it stands right now.
 *
 * The landing screen's second column used to hold four hand-written news
 * cards explaining what Liberland is — the newest of them from early 2025.
 * Help text that answers no question a person arrived with, and goes stale
 * on its own, is the wrong thing to give a quarter of the first screen to.
 *
 * What replaces it is the chain's own answer to three questions a citizen
 * actually has: what is the state about to do, where did the money go, and
 * how is the republic doing. Every figure here is read from the same store
 * the rest of the app fills, so nothing is invented and nothing is a
 * placeholder: a figure that has not arrived is simply absent.
 */

/** An asset code the spending feed uses for "none recorded". */
const NONE = '-';

/* The shared truncate cuts from the middle, which is right for an address
 * and wrong for a sentence; a description reads from its start. */
const shorten = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

/**
 * What the scheduler will execute, soonest first.
 *
 * This is the one piece of the dashboard that is chain truth about the
 * future: a referendum that passed is not law until the scheduler runs it,
 * and until now nothing on the landing screen said when that would be.
 *
 * Calls whose preimage is too large to fetch are still listed — knowing
 * something lands on a given block matters more than naming it, and an
 * entry silently dropped would be worse than one that reads "A scheduled
 * call".
 */
export function readScheduledCalls(scheduledCalls, currentBlock, limit = 5) {
  if (!scheduledCalls?.length) return [];

  return scheduledCalls
    .map((item) => {
      const block = item.blockNumber?.toNumber?.() ?? Number(item.blockNumber);
      const blocksLeft = currentBlock != null && Number.isFinite(block)
        ? block - Number(currentBlock)
        : null;
      const call = item.preimage || item.proposal || null;
      return {
        key: `${block}-${item.idx ?? 0}`,
        block,
        blocksLeft,
        title: call ? motionTitle(call) : 'A scheduled call',
        origin: item.sectionType || null,
        when: blocksLeft != null && blocksLeft > 0 ? blocksToText(blocksLeft) : null,
      };
    })
    // Something already executed is history, and the agenda keeps it briefly.
    .filter((item) => item.blocksLeft == null || item.blocksLeft > 0)
    .sort((a, b) => a.block - b.block)
    .slice(0, limit);
}

/**
 * Where the treasury's money went, most recent first.
 *
 * The figures come from the government-spending record, which carries the
 * project and category a payment was made under. That context is the whole
 * value of the line — "4,000 LLD" tells a citizen nothing, "4,000 LLD ·
 * Infrastructure · node hosting" tells them what their state bought.
 */
export function readSpending(spending, limit = 5) {
  const rows = spending?.data || spending;
  if (!rows?.length) return [];

  return rows
    .filter((row) => row && row.value !== NONE)
    .slice(0, limit)
    .map((row, idx) => {
      const symbol = row.asset === 'LLM' || row.asset === 'LLD' ? row.asset : null;
      const amount = symbol ? `${formatAssets(row.value, 12)} ${symbol}` : null;
      const parts = [row.project, row.category].filter((p) => p && p !== NONE);
      return {
        key: `${row.timestamp instanceof Date ? row.timestamp.getTime() : idx}-${idx}`,
        date: row.timestamp instanceof Date ? row.timestamp : null,
        amount,
        usd: row.amountInUsd && row.amountInUsd !== NONE ? row.amountInUsd : null,
        what: (() => {
          const text = parts.length
            ? parts.join(' · ')
            : (row.description !== NONE && row.description) || null;
          return text ? shorten(text, 44) : null;
        })(),
        recipient: row.recipient !== NONE ? row.recipient : null,
      };
    });
}

/** Percentages arrive as fractions; two decimals is as fine as they are true. */
export function formatPercent(value) {
  if (value == null) return null;
  return `${Math.round(10000 * value) / 100}%`;
}

/**
 * The republic in figures, from the chain's weekly statistics.
 *
 * Only what has actually arrived is returned, so the block renders three
 * figures rather than five placeholders when the service is partly down.
 */
export function readFigures(finances) {
  if (!finances) return [];

  const figures = [
    {
      key: 'apy',
      label: 'Staker APY',
      value: formatPercent(finances.stakerApyWeeklyPayouts),
      note: 'From last week’s payouts',
    },
    {
      key: 'inflation',
      label: 'Inflation',
      value: formatPercent(finances.inflation),
      note: 'Annualised',
    },
    {
      key: 'total',
      label: 'Total LLD',
      value: finances.totalLld != null ? formatCustom(finances.totalLld, 0) : null,
      note: 'In existence',
    },
    {
      key: 'stakers',
      label: 'Paid to stakers',
      value: finances.lastWeekStakersRewards != null
        ? `${formatDollars(finances.lastWeekStakersRewards)} LLD`
        : null,
      note: 'Last week',
    },
    {
      key: 'congress',
      label: 'Paid to Congress',
      value: finances.lastWeekCongressRewards != null
        ? `${formatDollars(finances.lastWeekCongressRewards)} LLD`
        : null,
      note: 'Last week',
    },
  ];

  return figures.filter((figure) => figure.value != null);
}
