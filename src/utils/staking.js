import {
  extractTime, bnMin, BN_MAX_INTEGER, BN,
  BN_ZERO, BN_ONE,
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
