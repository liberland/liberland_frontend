import {
  extractTime, bnMin, BN_MAX_INTEGER, BN,
} from '@polkadot/util';

export const eraToDays = (era) => Math.round(era.toNumber() / 4);
export const blockTime = (blocks) => {
  const value = bnMin(BN_MAX_INTEGER, new BN(6000).mul(blocks)).toNumber();
  return extractTime(Math.abs(value));
};

export const blockTimeFormatted = (blocks) => {
  const {
    days,
    hours,
    minutes,
  } = blockTime(blocks);

  const formattedDays = days <= 0 ? '' : `${days} Days`;
  const formattedHrs = hours <= 0 ? '' : `${hours} Hrs`;
  const formattedMins = minutes <= 0 ? '' : `${minutes} Mins`;

  return [formattedDays, formattedHrs, formattedMins].join(' ');
};
