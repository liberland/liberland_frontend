import { BN_ZERO } from '@polkadot/util';
import { parseMerits } from './walletHelpers';

export default class Validator {
  static email() {
    return /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  }

  static name() {
    return /^\s*([A-Za-z]{1,}([.,] |[-']| ))+[A-Za-z]+\.?\s*$/g;
  }

  static password() {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  }

  static validateUnbondValue(maxUnbond, textUnbondValue) {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  }
}
