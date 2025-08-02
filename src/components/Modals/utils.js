import { randomBytes } from 'crypto';
import { isAddress } from 'thirdweb';

// TODO add validate solana once we upgrade to node 20
export const validateFinalDestination = (finalDestination) => (
  isAddress(finalDestination)
);

export const getTransmitterWallets = () => {
  /**
   * @type string[]
   */
  const trasmitterWallets = JSON.parse(process.env.REACT_APP_TRANSMITTER_WALLETS);
  return trasmitterWallets;
};

export const getTransmitterIndex = (recipient) => getTransmitterWallets().indexOf(recipient);

export const createGovtCrosschainPayment = ({
  recipient,
  finalDestination,
}) => {
  const buffer = randomBytes(4);
  const hexString = buffer.toString('hex');
  const orderId = window.BigInt(`0x${hexString}`).toString();
  const transmitterIndex = getTransmitterIndex(recipient);
  if (!validateFinalDestination(finalDestination)) {
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
