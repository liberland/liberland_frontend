import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useAddIdToContext } from '../hooks/useAddIdToContext';
import { identitySelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';

function TransferLLD({ proposal }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].value.toString();
  const value = proposal.args[1];
  const formattedValue = formatDollars(value);
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (LLD) `}
      <b>to</b>
      {` ${identity ? `${identity} (${accountId})` : accountId}`}
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferLLD.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferLLD;
