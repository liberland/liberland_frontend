import React from 'react';
import PropTypes from 'prop-types';
import useTransferLLM from '../hooks/useTransferLLM';

function TransferLLMRow({ proposal }) {
  const {
    accountId,
    formattedValue,
    identity,
    symbol,
  } = useTransferLLM(proposal);

  return (
    <tr>
      <td>
        {`${formattedValue} (${symbol})`}
      </td>
      <td>
        {`${identity ? `${identity} (${accountId})` : accountId}`}
      </td>
    </tr>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferLLMRow.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferLLMRow;
