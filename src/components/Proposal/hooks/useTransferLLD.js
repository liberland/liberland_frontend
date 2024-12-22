import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAddIdToContext } from './useAddIdToContext';
import { identitySelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function useTransferLLD(proposal) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].value.toString();
  const value = proposal.args[1];
  const formattedValue = formatDollars(value);
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

  const memoized = useMemo(() => (
    <CopyIconWithAddress
      isTruncate
      name={identity?.name}
      legal={identity?.legal}
      address={accountId}
      showAddress
    />
  ), [accountId, identity?.legal, identity?.name]);

  return {
    formattedValue,
    identity,
    accountId,
    formattedRow: [
      `${formattedValue} (LLD)`,
      memoized,
    ],
  };
}

export default useTransferLLD;
