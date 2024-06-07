import { BN_ZERO } from '@polkadot/util';
import { parseMerits, parseDollars } from './walletHelpers';

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

  static validateValue(maxValue, value) {
    if (value.gt(maxValue) || value.lte(BN_ZERO)) return 'Invalid amount';
    return true;
  }

  static validateMeritsValue(maxValue, textValue) {
    try {
      const value = parseMerits(textValue);
      return Validator.validateValue(maxValue, value);
    } catch (e) {
      return 'Invalid amount';
    }
  }

  static validateDollarsValue(maxValue, textValue) {
    try {
      const value = parseDollars(textValue);
      return Validator.validateValue(maxValue, value);
    } catch (e) {
      return 'Invalid amount';
    }
  }
}
