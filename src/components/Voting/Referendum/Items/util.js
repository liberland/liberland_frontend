import { valueToBN } from '../../../../utils/walletHelpers';

export const votePercentage = ({ yayVotes, nayVotes }) => {
  const yays = valueToBN(yayVotes.toBigInt());
  const nays = valueToBN(nayVotes.toBigInt());
  if (yays.isZero() && nays.isZero()) {
    return valueToBN(0);
  }
  const ratio = valueToBN(100)
    .mul(yays).div(yays.add(nays))
    .toNumber();

  return ratio;
};
