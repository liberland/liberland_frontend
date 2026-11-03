/*
 * Finding one scheduled call by the address in the link.
 *
 * A route parameter is always a string and the agenda index is a number, so
 * matching them with `===` never succeeded — this address could not work
 * even with the agenda in hand.
 *
 * The index is only unique within a block, so a dispatch is addressed by
 * `<block>-<index>`. A bare index is still accepted, since that is what any
 * link made before this carries, and it matches the first such index.
 */
export function findDispatch(scheduledCalls, dispatchId) {
  if (!scheduledCalls?.length || !dispatchId) return undefined;
  const [block, idx] = String(dispatchId).split('-');

  if (idx !== undefined) {
    return scheduledCalls.find((item) => String(item.blockNumber) === block
      && String(item.idx) === idx);
  }
  return scheduledCalls.find((item) => String(item.idx) === block);
}

export default findDispatch;
