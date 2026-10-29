import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  congressActions, contractsActions, democracyActions, senateActions,
} from '../redux/actions';
import {
  blockchainSelectors,
  congressSelectors,
  contractsSelectors,
  democracySelectors,
  senateSelectors,
} from '../redux/selectors';
import {
  contractTasks, electionTask, motionTasks, referendumTasks, sortTasks,
} from '../utils/pendingTasks';

/*
 * Everything the dApp is currently waiting on this person for.
 *
 * The landing screen is the one page every session starts on, so this is what
 * gets fetched there. Each source is asked for only when it can produce
 * something: chamber motions are fetched after membership is known, because a
 * citizen who sits on neither chamber would otherwise pay for a query whose
 * every result is discarded.
 *
 * Nothing here blocks the screen. The list grows as the chain answers, which
 * is why the panel reports that it is still looking rather than claiming an
 * empty list the moment it mounts.
 */
export default function usePendingTasks() {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const currentBlock = useSelector(blockchainSelectors.blockNumber);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const isDemocracyLoading = useSelector(democracySelectors.selectorGettingDemocracyInfo);

  const congressMotions = useSelector(congressSelectors.motions);
  const isCongressMember = useSelector(congressSelectors.userIsMember);
  const senateMotions = useSelector(senateSelectors.motions);
  const isSenateMember = useSelector(senateSelectors.userIsMember);
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
    dispatch(congressActions.getMembers.call());
    dispatch(senateActions.senateGetMembers.call());
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch, walletAddress]);

  // Motions cost a query per proposal, and only a member of the chamber can do
  // anything about one, so they are fetched once membership says it is worth it.
  useEffect(() => {
    if (isCongressMember) dispatch(congressActions.getMotions.call());
  }, [dispatch, isCongressMember]);

  useEffect(() => {
    if (isSenateMember) dispatch(senateActions.senateGetMotions.call());
  }, [dispatch, isSenateMember]);

  const info = democracy?.democracy;

  const tasks = useMemo(() => sortTasks([
    ...motionTasks({
      motions: congressMotions,
      isMember: isCongressMember,
      walletAddress,
      currentBlock,
      chamber: 'congress',
    }),
    ...motionTasks({
      motions: senateMotions,
      isMember: isSenateMember,
      walletAddress,
      currentBlock,
      chamber: 'senate',
    }),
    ...referendumTasks({
      referendums: info?.crossReferencedReferendumsData,
      walletAddress,
      isDelegating: Boolean(info?.userVotes?.Delegating?.target),
      currentBlock,
    }),
    ...electionTask({
      electionsInfo: info?.electionsInfo,
      candidates: info?.candidates,
      myVotes: info?.currentCandidateVotesByUser,
      currentBlock,
    }),
    ...contractTasks({ myContracts, walletAddress }),
  ]), [
    congressMotions, isCongressMember, senateMotions, isSenateMember,
    info, myContracts, walletAddress, currentBlock,
  ]);

  // "Nothing is waiting" and "we have not looked yet" are different answers,
  // and showing the first while the second is true is a lie the user acts on.
  const hasAnswered = Boolean(info) || Boolean(myContracts);

  return {
    tasks,
    isLoading: !hasAnswered || Boolean(isDemocracyLoading),
    isSignedIn: Boolean(walletAddress),
  };
}
