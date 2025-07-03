import React from 'react';
import { formatDollars, sanitizeValue } from '../../../../utils/walletHelpers';
import StakeParticipantDisplay from '../../StakeParticipantDisplay';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import DollarValue from '../DollarValue';
import IsAvailableForStaking from '../IsAvailableForStaking';
import Nominated from '../Nominated';

export const getValidatorDisplay = ({
  validators,
  selectedValidatorsAsTargets,
  toggleSelectedValidator,
  selectingValidatorsDisabled,
  identities,
}) => [...validators]
  .sort(({ stakedReturnCmp: aProfit }, { stakedReturnCmp: bProfit }) => bProfit - aProfit)
  .map(({
    bondTotal,
    bondOwn,
    bondOther,
    commission,
    blocked,
    stakedReturnCmp,
    accountId,
  }) => {
    const address = accountId?.toString();
    const totalSanitized = bondTotal && sanitizeValue(bondTotal.toString());
    const totalValue = totalSanitized && formatDollars(totalSanitized);
    const ownSanitized = bondOwn && sanitizeValue(bondOwn.toString());
    const ownValue = ownSanitized && formatDollars(ownSanitized);
    const otherValue = bondOther && formatDollars(sanitizeValue(bondOther.toString()));
    const nominatedByMe = selectedValidatorsAsTargets.includes(address);
    return {
      name: (
        <StakeParticipantDisplay
          address={address}
          displayName={identities?.[address]?.identity?.legal || identities?.[address]?.identity?.name}
        />
      ),
      address: <CopyIconWithAddress address={address} isTruncate />,
      total: (
        <DollarValue value={totalValue} />
      ),
      own: (
        <DollarValue value={ownValue} />
      ),
      other: (
        <DollarValue value={otherValue} />
      ),
      commission,
      allowed: <IsAvailableForStaking blocked={blocked} />,
      profit: `${(Math.round(100 * stakedReturnCmp) / 100) || 0}%`,
      nominated: (
        <Nominated
          address={address}
          toggleSelectedValidator={toggleSelectedValidator}
          nominatedByMe={nominatedByMe}
          selectingValidatorsDisabled={selectingValidatorsDisabled(nominatedByMe)}
        />
      ),
    };
  });
