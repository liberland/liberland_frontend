import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { democracyActions } from '../../../../redux/actions';

/*
 * The democracy data, and whether it has arrived yet.
 *
 * Every single-item page under Voting — a proposal, a referendum, a dispatch
 * — finds its item inside one blob that is fetched on mount. Reached by
 * clicking through from the list, that blob is already in the store and the
 * item is there on the first render. Reached by its own link, on a cold load,
 * it is not: the page renders once with nothing, and each of these pages used
 * to read straight through the hole and throw.
 *
 * "Not here yet" and "no such thing" are different answers, and a page that
 * cannot tell them apart either crashes or spins forever. This returns both,
 * so a page can say which one it means.
 */
export default function useDemocracyInfo() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const isLoading = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  // Before the first success the reducer holds its initial shape, which has
  // no `democracy` key at all — so this is the honest test for "answered".
  const info = democracy?.democracy;

  return { info, hasLoaded: Boolean(info), isLoading };
}
