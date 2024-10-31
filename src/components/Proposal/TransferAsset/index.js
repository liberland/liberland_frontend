import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { identitySelectors, walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import { formatAssets } from '../../../utils/walletHelpers';
import { useAddIdToContext } from '../hooks/useAddIdToContext';

function TransferAsset({ proposal }) {
  const dispatch = useDispatch();
  const assetId = proposal.args[0];
  const target = proposal.args[1].toString();
  const value = proposal.args[2].toString();
  useAddIdToContext(target);

  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const [asset] = additionalAssets.filter((item) => item.index === Number(assetId));
  const formattedValue = asset ? formatAssets(value, asset?.metadata?.decimals) : value;
  const identity = names?.[target]?.identity;

  React.useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call(true));
  }, [dispatch]);

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
