import { useDispatch, useSelector } from 'react-redux';
import { blockchainSelectors } from '../../../redux/selectors';
import { walletAddress } from '../../../redux/selectors/congress';

/*
 * Everything a motion lets the signed-in member do, decided in one place.
 *
 * Three screens now offer these buttons — the Ledger card, the State card and
 * the motion's own page — and all three must agree on when a motion can be
 * closed and what each button dispatches. The two close paths are genuinely
 * different and must stay so: closing a passed motion sends no wallet
 * address, closing a rejected one does.
 */
export default function useMotionActions({
  proposal, voting, voteMotion, closeMotion, membersCount,
}) {
  const dispatch = useDispatch();
  const userAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const threshold = voting.threshold.toNumber();
  const isClosable = voting.ayes.length >= threshold;
  const isClosableNaye = voting.nays.length > membersCount - threshold;

  const votedAye = voting.ayes.map((v) => v.toString()).includes(userAddress);
  const votedNay = voting.nays.map((v) => v.toString()).includes(userAddress);

  return {
    threshold,
    isClosable,
    isClosableNaye,
    userHasVotedAye: votedAye,
    userHasVotedNay: votedNay,
    canVoteAye: !votedAye && !isClosable,
    canVoteNay: !votedNay && !isClosable,
    vote: (aye) => dispatch(voteMotion({ proposal, index: voting.index, vote: aye })),
    closeExecute: () => dispatch(closeMotion({ proposal, index: voting.index })),
    closeRejected: () => dispatch(closeMotion({ proposal, index: voting.index, walletAddress })),
  };
}
