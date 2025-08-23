import {
  extractTime, bnMin, BN_MAX_INTEGER, BN,
  BN_ZERO, BN_ONE,
  BN_MILLION,
  BN_HUNDRED,
  arrayFlatten,
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

  const formattedTime = [formattedDays, formattedHrs, formattedMins].join(' ');
  return formattedTime === '  ' ? '< Min' : formattedTime;
};

export const stakingInfoToProgress = (stakingInfo, progress) => {
  if (!stakingInfo?.unlocking || stakingInfo.unlocking?.length === 0) return null;
  const isStalled = progress.eraProgress.gt(BN_ZERO) && progress.eraProgress.gt(progress.eraLength);

  /*
 * Copyright 2024 @polkadot-js/apps authors & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
  return stakingInfo.unlocking.filter(
    ({ remainingEras, value }) => value.gt(BN_ZERO)
    && remainingEras.gt(BN_ZERO),
  )
    .map((unlock) => ({
      unlock,
      eras: unlock.remainingEras,
      blocks: unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(
          // in the case of a stalled era, this would not be accurate. We apply the mod here
          // otherwise we would enter into negative values (which is "accurate" since we are
          // overdue, but confusing since it implied it needed to be done already).
          //
          // This does mean that in cases of era stalls we would have an jiggling time, i.e.
          // would be down and then when a session completes, would be higher again, just to
          // repeat the cycle again
          //
          // See https://github.com/polkadot-js/apps/issues/9397#issuecomment-1532465939
          isStalled
            ? progress.eraProgress.mod(progress.eraLength)
            : progress.eraProgress,
        ),
    }));
};

const DEFAULT_PARAMS = {
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  idealStake: 0.5,
};

export function calcInflation(totalIssuance, totalStaked) {
  const {
    falloff, maxInflation, minInflation, idealStake,
  } = DEFAULT_PARAMS;
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  const idealInterest = maxInflation / idealStake;

  const inflation = 100 * (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
      : (((idealInterest * idealStake) - minInflation) * (2 ** ((idealStake - stakedFraction) / falloff)))
  ));
  return {
    idealInterest,
    idealStake,
    inflation,
    stakedFraction,
    stakedReturn: stakedFraction
      ? (inflation / stakedFraction)
      : 0,
  };
}

const extractSingle = async (api, derive) => {
  const activeEra = (await api.query.staking.activeEra()).unwrap().index;
  return Promise.all(derive.info.map(async (item) => {
    const {
      accountId, stakingLedger, validatorPrefs,
    } = item;
    const exposure = await api.query.staking.erasStakers(activeEra, accountId);
    const bondOwn = exposure.own.unwrap();
    const bondTotal = exposure.total.unwrap();
    const skipRewards = bondTotal.isZero();
    const key = accountId.toString();
    const dataSkipRewards = stakingLedger.total?.unwrap() || BN_ZERO;

    return {
      key,
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn: skipRewards ? dataSkipRewards : bondOwn,
      bondTotal: skipRewards ? dataSkipRewards : bondTotal,
      isActive: !skipRewards,
      skipRewards,
      stakedReturn: 0,
      stakedReturnCmp: 0,
      commissionPer: validatorPrefs.commission.unwrap().toNumber() / 10_000_000,
      validatorPrefs,
    };
  }));
};

export async function getBaseInfo(api, elected, waitingInfo) {
  const baseInfo = await extractSingle(api, elected);
  const waiting = await extractSingle(api, waitingInfo);
  const activeTotals = baseInfo
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
    .sort((a, b) => a.cmp(b));
  const totalStaked = activeTotals.reduce((total, value) => total.iadd(value), new BN(0));
  const avgStaked = totalStaked.divn(activeTotals.length);
  const waitingIds = waiting.map(({ key }) => key);
  const validators = arrayFlatten([baseInfo, waiting]);
  return {
    totalStaked, avgStaked, waitingIds, validators,
  };
}

export function addReturns(inflation, baseInfo) {
  const { avgStaked } = baseInfo;
  const { validators } = baseInfo;

  if (!validators || !avgStaked || avgStaked.isZero()) {
    return baseInfo;
  }

  const list = validators.map((v) => {
    if (v.isActive) {
      const stakedReturn = avgStaked
        .mul(BN_HUNDRED)
        .imuln(inflation.stakedReturn)
        .div(v.bondTotal)
        .toNumber() / 100;
      const stakedReturnCmp = (stakedReturn * (100 - v.commissionPer)) / 100;
      return { ...v, stakedReturn, stakedReturnCmp };
    }
    return v;
  });

  return { ...baseInfo, validators: list };
}

export function areArraysSame(arr1, arr2) {
  return arr1.slice().sort().toString() === arr2.slice().sort().toString();
}
