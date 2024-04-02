import { BN } from '@polkadot/util';

const LPFeeDefault = 0.5;

export async function getAmountOut(amountIn, reserveIn, reserveOut, LPFee = LPFeeDefault) {
  const amountInWithFee = amountIn.mul(new BN(1000).sub(new BN(LPFee * 10)));
  const numerator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.mul(new BN(1000)).add(amountInWithFee);

  const result = numerator.div(denominator);
  return result.toString();
}

export async function getAmountsOut(amountIn, path, reserveIn, reserveOut) {
  const amountOut = await getAmountOut(amountIn, reserveIn, reserveOut);

  return [amountOut];
}

export async function getAmountIn(amountOut, reserveIn, reserveOut, LPFee = LPFeeDefault) {
  if (reserveIn.isZero() || reserveOut.isZero()) {
    throw new Error('ZeroLiquidity');
  }

  if (amountOut.gte(reserveOut)) {
    throw new Error('AmountOutTooHigh');
  }

  const numerator = reserveIn
    .mul(amountOut)
    .mul(new BN(1000));

  const denominator = reserveOut
    .sub(amountOut)
    .mul(new BN(1000).sub(new BN(LPFee * 10)));

  const result = numerator
    .div(denominator)
    .add(new BN(1));

  return result.toString();
}

export async function getAmountsIn(amountOut, path, reserveIn, reserveOut) {
  const amountIn = await getAmountIn(amountOut, reserveIn, reserveOut);

  return [amountIn];
}
