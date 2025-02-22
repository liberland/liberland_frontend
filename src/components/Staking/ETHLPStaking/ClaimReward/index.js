import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { ethActions } from '../../../../redux/actions';

function ClaimReward({
  account,
}) {
  const dispatch = useDispatch();
  const connected = useSelector(ethSelectors.selectorConnected);
  const loading = useSelector(ethSelectors.selectorEthLoading);

  if (!connected) {
    return null;
  }

  return (
    <Button
      primary
      disabled={loading}
      onClick={async () => {
        try {
          const signer = await connected.provider.getSigner(account);
          dispatch(ethActions.claimReward.call({ account: signer }));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }}
    >
      {loading ? 'Loading...' : 'Claim reward!'}
    </Button>
  );
}

ClaimReward.propTypes = {
  account: PropTypes.string.isRequired,
};

export default ClaimReward;
