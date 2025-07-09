import {
  createKeyMulti,
  encodeAddress,
  sortAddresses,
} from '@polkadot/util-crypto';
import { getSS58Prefix } from '../api/nodeRpcCall';

const SS58Prefix = getSS58Prefix(); // Substrate's SS58 prefix
const MULTISIG_STORAGE_KEY = 'liberland_multisigs';

export const createMultisigAddress = ({
  signatories,
  threshold,
}) => {
  const sortedSignatories = sortAddresses(signatories, SS58Prefix);
  const multiAddress = createKeyMulti(sortedSignatories, threshold);
  const multisigAddress = encodeAddress(multiAddress, SS58Prefix);

  return multisigAddress;
};

export const loadMultisigsFromStorage = () => {
  const stored = localStorage.getItem(MULTISIG_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveMultisigToStorage = (multisig) => {
  const existingMultisigs = loadMultisigsFromStorage();
  const alreadyExists = existingMultisigs.some((m) => m.address === multisig.address);
  if (alreadyExists) return;
  const updatedMultisigs = [...existingMultisigs, multisig];
  localStorage.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(updatedMultisigs));
};

// Create multisig data object
export const createMultisigData = (multisigData) => {
  const {
    signatories, threshold, name,
  } = multisigData;

  const address = createMultisigAddress({ signatories, threshold });

  const multisig = {
    address,
    signatories,
    threshold,
    name,
  };

  saveMultisigToStorage(multisig);

  return multisig;
};

export const removeMultisigFromStorage = (multisigAddress) => {
  const existingMultisigs = loadMultisigsFromStorage();
  const updatedMultisigs = existingMultisigs.filter(
    (multisig) => multisig.address !== multisigAddress,
  );
  localStorage.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(updatedMultisigs));
};

export const isUserSignatory = (multisig, userAddress) => multisig.signatories.includes(userAddress);

export const getUserMultisigs = (userAddress) => {
  const allMultisigs = loadMultisigsFromStorage();
  return allMultisigs.filter((multisig) => isUserSignatory(multisig, userAddress));
};

export const validateMultisigParams = (signatories, threshold) => {
  const errors = [];

  if (!Array.isArray(signatories) || signatories.length === 0) {
    errors.push('At least one signatory is required');
  }

  if (signatories.length > 100) {
    errors.push('Maximum 100 signatories allowed');
  }

  if (threshold < 1) {
    errors.push('Threshold must be at least 1');
  }

  if (threshold > signatories.length) {
    errors.push('Threshold cannot exceed number of signatories');
  }

  // Check for duplicate signatories
  const uniqueSignatories = [...new Set(signatories)];
  if (uniqueSignatories.length !== signatories.length) {
    errors.push('Duplicate signatories are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const importMultisigsFromJson = (jsonString) => {
  try {
    const importedData = JSON.parse(jsonString);
    if (!Array.isArray(importedData)) {
      throw new Error('Invalid format: expected array of multisigs');
    }

    return importedData.map((item) => {
      const validation = validateMultisigParams(item.signatories, item.threshold);
      if (!validation.isValid) {
        throw new Error(`Invalid multisig: ${validation.errors.join(', ')}`);
      }

      return createMultisigData(item, 'imported');
    });
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};
