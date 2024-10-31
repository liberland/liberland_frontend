import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { identitySelectors } from '../../../redux/selectors';
import { formatMerits } from '../../../utils/walletHelpers';
import { useAddIdToContext } from '../hooks/useAddIdToContext';

function TransferLLM({ proposal }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].toString();
  const value = proposal.args[1];
  const formattedValue = formatMerits(value);
  const symbol = proposal.method === 'sendLlm' ? 'LLM' : 'PolitiPooled LLM';
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

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
