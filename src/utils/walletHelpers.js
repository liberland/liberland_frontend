import {
  BN, formatBalance, formatNumber, hexToU8a, isHex,
} from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { ethers } from 'ethers';
import { parseInt } from 'lodash';
import { IndexHelper } from './council/councilEnum';

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

const _format = (value, decimals, withAll = false, precision = undefined) => {
  const round = precision && new BN(10 ** (decimals - precision));
  return formatBalance(
    round ? valueToBN(value).divRound(round).mul(round) : valueToBN(value),
    {
      decimals,
      forceUnit: '-',
      withSi: false,
      locale: 'en',
      withZero: false,
      withAll,
    },
  );
};

export const sanitizeValue = (value) => value.replace(/,/g, '');

const _parse = (value, decimals) => {
  const ethersBN = ethers.utils.parseUnits(value, decimals);
  return new BN(ethersBN.toHexString().replace(/^0x/, ''), 'hex');
};

export const formatMerits = (grains, withAll = false, precision = undefined) => _format(
  grains,
  meritDecimals,
  withAll,
  precision,
);
export const formatDollars = (grains, withAll = false, precision = undefined) => _format(
  grains,
  dollarDecimals,
  withAll,
  precision,
);
export const formatCustom = (grains, decimals, withAll = false, precision = undefined) => _format(
  grains,
  decimals,
  withAll,
  precision,
);
export const parseMerits = (merits) => _parse(merits, meritDecimals);
export const parseDollars = (dollars) => _parse(dollars, dollarDecimals);
export const parseAssets = (assets, assetDecimals) => _parse(assets, assetDecimals);

export const tryFormatDollars = (grains, withAll = false) => {
  try {
    return formatDollars(grains, withAll);
  } catch {
    return '0';
  }
};

export const tryFormatNumber = (value) => {
  try {
    return formatNumber(value);
  } catch {
    return '0';
  }
};

const defaultFormatAssetsSettings = {
  withAll: false,
  optionalAll: false,
  symbol: null,
};
export const formatAssets = (assets, assetDecimals, settingsProps = defaultFormatAssetsSettings) => {
  const settings = { ...defaultFormatAssetsSettings, ...settingsProps };
  const { withAll, optionalAll, symbol } = settings;
  const formatedValue = _format(assets, Number(assetDecimals), withAll);
  if (optionalAll && formatedValue === '0' && !withAll) {
    return formatAssets(assets, assetDecimals, { symbol, withAll: true });
  }
  const returnValue = symbol ? `${formatedValue} ${symbol}` : formatedValue;
  return returnValue;
};

const configDefault = {
  isSymbolFirst: false,
  isAsset: false,
};

export const formatTransaction = (value_raw, bigSymbol, decimals, config = configDefault) => {
  const value = valueToBN(value_raw);
  const absIntvalue = value.abs();
  const formatValue = _format(absIntvalue, config.isAsset ? parseInt(decimals) : decimals, true, config.precision);

  return config.isSymbolFirst
    ? `${bigSymbol} ${formatValue}`
    : `${formatValue} ${bigSymbol}`;
};

export const formatMeritTransaction = (merits_raw, config = configDefault) => formatTransaction(
  merits_raw,
  'LLM',
  meritDecimals,
  config,
);

export const formatDollarTransaction = (dollars_raw, config = configDefault) => formatTransaction(
  dollars_raw,
  'LLD',
  dollarDecimals,
  config,
);

export const formatAssetTransaction = (dollars_raw, asset, decimals, config = configDefault) => formatTransaction(
  dollars_raw,
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

export const calculateProperBalance = (balance, index, decimals) => {
  if (index === IndexHelper.LLD) {
    return parseDollars(balance);
  } if (index === IndexHelper.POLITIPOOL_LLM) {
    return parseMerits(balance);
  }
  return parseAssets(balance, decimals);
};
