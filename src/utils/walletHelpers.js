import {
  BN, BN_ONE, BN_ZERO, formatBalance, hexToU8a, isHex,
} from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { ethers } from 'ethers';
import { parseInt } from 'lodash';

const meritDecimals = 12;
const dollarDecimals = 12;

// take string or number and parse to BN using correct base
export const valueToBN = (i) => {
  const s = i.toString();
  if (s.startsWith && s.startsWith('0x')) {
    return new BN(s.slice(2), 16);
  }
  return new BN(s);
};

const _format = ((value, decimals, withAll = false) => formatBalance(
  valueToBN(value),
  {
    decimals,
    forceUnit: '-',
    withSi: false,
    locale: 'en',
    withZero: false,
    withAll,
  },
));

export const sanitizeValue = (value) => value.replace(/,/g, '');

const _parse = (value, decimals) => {
  const ethersBN = ethers.utils.parseUnits(value, decimals);
  return new BN(ethersBN.toHexString().replace(/^0x/, ''), 'hex');
};

export const formatMerits = (grains, withAll = false) => _format(grains, meritDecimals, withAll);
export const formatDollars = (grains, withAll = false) => _format(grains, dollarDecimals, withAll);
export const formatCustom = (grains, decimals, withAll = false) => _format(grains, decimals, withAll);
export const parseMerits = (merits) => _parse(merits, meritDecimals);
export const parseDollars = (dollars) => _parse(dollars, dollarDecimals);
export const parseAssets = (assets, assetDecimals) => _parse(assets, assetDecimals);

const defaultFormatAssetsSettings = {
  withAll: false,
  symbol: null,
};
export const formatAssets = (assets, assetDecimals, settingsProps = defaultFormatAssetsSettings) => {
  const settings = { ...defaultFormatAssetsSettings, ...settingsProps };
  const { withAll, symbol } = settings;
  const formatedValue = _format(assets, Number(assetDecimals), withAll);
  const returnValue = symbol ? `${formatedValue} ${symbol}` : formatedValue;
  return returnValue;
};

const configDefault = {
  isSymbolFirst: false,
  isAsset: false,
};

export const formatTransaction = (value_raw, bigSymbol, smallSymbol, decimals, config = configDefault) => {
  const value = valueToBN(value_raw);
  const prefix = value.gt(BN_ZERO) ? '+' : '-';
  const absIntvalue = value.abs();

  if (_parse(absIntvalue.toString(), decimals).gt(BN_ONE)) {
    const formatValue = _format(absIntvalue, config.isAsset ? parseInt(decimals) : decimals, true);

    return config.isSymbolFirst
      ? `${bigSymbol} ${prefix}${formatValue}`
      : `${prefix} ${formatValue} ${bigSymbol}`;
  }

  return config.isSymbolFirst
    ? `${smallSymbol} ${prefix}${_format(absIntvalue, 0)}`
    : `${prefix} ${_format(absIntvalue, 0)} ${smallSymbol}`;
};

export const formatMeritTransaction = (merits_raw, config = configDefault) => formatTransaction(
  merits_raw,
  'LLM',
  'grains',
  meritDecimals,
  config,
);

export const formatDollarTransaction = (dollars_raw, config = configDefault) => formatTransaction(
  dollars_raw,
  'LLD',
  'picoLLD',
  dollarDecimals,
  config,
);

export const formatAssetTransaction = (dollars_raw, asset, decimals, config = configDefault) => formatTransaction(
  dollars_raw,
  asset,
  asset,
  decimals,
  config,
);

export const isValidSubstrateAddress = (address) => {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address),
    );

    return true;
  } catch (error) {
    return false;
  }
};

export const calculateSlippage = (
  amount,
  minAmountPercent,
) => {
  const defaultMinPercent = 0.5;
  const denominator = 10000;
  const slippagePercentBN = new BN(((Number(minAmountPercent) || defaultMinPercent) * denominator) / 100);
  return new BN(amount).mul(slippagePercentBN).div(new BN(denominator));
};

export const calculateAmountMax = (
  amount,
  minAmountPercent,
) => {
  const slippage = calculateSlippage(
    amount,
    minAmountPercent,
  );
  const amountBN = new BN(amount);
  return slippage.isZero() ? amountBN : amountBN.add(slippage);
};

export const calculateAmountMin = (
  amount,
  minAmountPercent,
) => {
  const slippage = calculateSlippage(
    amount,
    minAmountPercent,
  );
  const amountBN = new BN(amount);
  return slippage.isZero() ? amountBN : new BN(amount).sub(slippage);
};
