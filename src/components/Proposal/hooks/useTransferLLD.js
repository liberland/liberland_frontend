import React from 'react';
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

  return {
    formattedValue,
    identity,
    accountId,
    formattedRow: [
      `${formattedValue} (LLD)`,
      <CopyIconWithAddress
        isTruncate
        name={identity?.name}
        legal={identity?.legal}
        address={accountId}
        showAddress
      />,
    ],
  };
}

export default useTransferLLD;
