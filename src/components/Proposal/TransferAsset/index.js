import React from 'react';
import PropTypes from 'prop-types';
import useTransferAsset from '../hooks/useTransferAsset';

function TransferAsset({ proposal }) {
  const {
    asset,
    assetId,
    formattedValue,
    identity,
    target,
  } = useTransferAsset(proposal);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (${asset?.metadata?.symbol || assetId}) `}
      <b>to</b>
      {` ${identity ? `${identity} (${target})` : target}`}
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferAsset.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferAsset;
