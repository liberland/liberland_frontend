import React from 'react';
import PropTypes from 'prop-types';
import useTransferAsset from '../hooks/useTransferAsset';

function TransferAssetRow({ proposal }) {
  const {
    asset,
    assetId,
    formattedValue,
    identity,
    target,
  } = useTransferAsset(proposal);

  return (
    <tr>
      <td>
        {`${formattedValue} (${asset?.metadata?.symbol || assetId}) `}
      </td>
      <td>
        {`${identity ? `${identity} (${target})` : target}`}
      </td>
    </tr>
  );
}

// eslint-disable-next-line react/forbid-prop-types
TransferAssetRow.propTypes = { proposal: PropTypes.object.isRequired };

export default TransferAssetRow;
