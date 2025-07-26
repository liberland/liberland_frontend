import { randomBytes } from 'crypto';
import { isAddress } from 'thirdweb';
import { PublicKey } from '@solana/web3.js';

const isValidSolanaAddress = (address) => {
  try {
    return PublicKey.isOnCurve(new PublicKey(address));
  } catch {
    return false;
  }
};

export const createGovtCrosschainPayment = ({
  recipient,
  finalDestination,
}) => {
  const buffer = randomBytes(4);
  const hexString = buffer.toString('hex');
  const orderId = window.BigInt(`0x${hexString}`).toString();
  /**
   * @type string[]
   */
  const trasmitterWallets = JSON.parse(process.env.REACT_APP_TRANSMITTER_WALLETS);
  const transmitterIndex = trasmitterWallets.indexOf(recipient);
  if (!isAddress(finalDestination) && !isValidSolanaAddress(finalDestination)) {
    throw new Error(`${finalDestination} is not a valid ETH or SOL address`);
  }
  if (transmitterIndex === -1) {
    throw new Error(`Recipient ${recipient} is not a valid transmitter`);
  }
  /**
   * @type string[]
   */
  const transmitterHooks = JSON.parse(process.env.REACT_APP_TRANSMITTER_HOOKS);
  const transmitterHook = transmitterHooks[transmitterIndex];
  return {
    orderId,
    transmitterHook,
  };
};
