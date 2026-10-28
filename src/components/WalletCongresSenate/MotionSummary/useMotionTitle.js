import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import { decodeCall } from '../../../api/nodeRpcCall';
import { motionTitle, referendumLookup } from '../../../utils/motions';

/*
 * The motion's title, resolved through a preimage when it needs one.
 *
 * A motion that puts a question to the citizens carries only the hash of that
 * question; the question itself lives in a preimage fetched separately. A
 * title derived from the call alone can therefore only name the hash, which
 * made every one of these motions read alike — "Put 0xf096…7f29 to
 * referendum" — while the act's real name sat in the details below it.
 *
 * The preimage is usually already in the store, fetched for the body of the
 * card; it is asked for here as well, so a title does not depend on something
 * else having rendered first. Until it arrives the hash-based title stands,
 * which is honest rather than blank.
 */
export default function useMotionTitle(motion) {
  const dispatch = useDispatch();
  const [innerCall, setInnerCall] = useState(null);
  const preimages = useSelector(blockchainSelectors.preimages);

  const lookup = useMemo(() => referendumLookup(motion?.call), [motion?.call]);
  const key = lookup?.hash?.toString();
  const preimage = key ? preimages[key] : undefined;

  useEffect(() => {
    // `preimage === undefined` means nothing has been asked for yet; a
    // resolved None is an answer, and asking again would not change it.
    if (lookup && preimage === undefined) {
      dispatch(blockchainActions.fetchPreimage.call({ hash: lookup.hash, len: lookup.len }));
    }
  }, [dispatch, lookup, preimage]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (preimage?.isSome) {
        const decoded = await decodeCall(preimage.unwrap());
        if (!cancelled) setInnerCall(decoded);
      } else {
        // The row was reused for a different motion, or the preimage is gone.
        setInnerCall(null);
      }
    })();
    return () => { cancelled = true; };
  }, [preimage, key]);

  if (!lookup || !innerCall) return motion.title;
  return motionTitle(innerCall);
}
