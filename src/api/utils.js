import { hexToBytes, isAddress as isEthAddress } from 'thirdweb';
import { Keyring } from '@polkadot/api';
import { blake2AsU8a } from '@polkadot/util-crypto';

export const tryConvertAddress = (walletAddress) => {
  if (!isEthAddress(walletAddress)) {
    return walletAddress;
  }
  const addressBytes = hexToBytes(walletAddress);
  const result = new Uint8Array(24);
  const prefix = new TextEncoder().encode('evm:');
  result.set(prefix);
  result.set(addressBytes, 4);
  const blakeHash = blake2AsU8a(result, 256);
  const keyring = new Keyring();
  const address = keyring.encodeAddress(blakeHash, 42);

  return address;
};
