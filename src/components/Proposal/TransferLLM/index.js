import React from 'react';
import PropTypes from 'prop-types';
import useTransferLLM from '../hooks/useTransferLLM';

function TransferLLM({ proposal }) {
  const {
    accountId,
    formattedValue,
    identity,
    symbol,
  } = useTransferLLM(proposal);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (${symbol}) `}
      <b>to</b>
      {` ${identity ? `${identity} (${accountId})` : accountId}`}
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferLLM.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferLLM;
