import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identitySelectors, walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import { formatAssets } from '../../../utils/walletHelpers';
import { useAddIdToContext } from './useAddIdToContext';

function useTransferAsset(proposal) {
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

  return {
    formattedValue,
    identity,
    asset,
    assetId,
    target,
    formattedRow: [
      `${formattedValue} (${asset?.metadata?.symbol || assetId})`,
      `${identity ? `${identity} (${target})` : target}`,
    ],
  };
}

export default useTransferAsset;
