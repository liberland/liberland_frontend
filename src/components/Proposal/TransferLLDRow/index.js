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
    <tr>
      <td>
        {`${formattedValue} (LLD) `}
      </td>
      <td>
        {`${identity ? `${identity} (${accountId})` : accountId}`}
      </td>
    </tr>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferLLD.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferLLD;
