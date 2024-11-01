import React from 'react';
import PropTypes from 'prop-types';
import useTransferLLD from '../hooks/useTransferLLD';

function TransferLLD({ proposal }) {
  const {
    accountId,
    formattedValue,
    identity,
  } = useTransferLLD(proposal);

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
