import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';

export const getHashAndLength = (boundedCall) => {
  if (boundedCall.lookup) {
    return [boundedCall.lookup.hash, boundedCall.lookup.len];
  }
  if (boundedCall.legacy) {
    return [boundedCall.legacy.hash, 0];
  }
  return [blake2AsHex(hexToU8a(boundedCall.inline)), 0];
};
