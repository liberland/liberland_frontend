import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { claimRewards } from '../../../../api/ethereum';

function ClaimReward({
  account,
}) {
  const connected = useSelector(ethSelectors.selectorConnected);

  return (
    <Button
      primary
      onClick={async () => {
        try {
          const signer = await connected.provider.getSigner(account);
          await claimRewards(signer);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }}
    >
      Claim reward!
    </Button>
  );
}

ClaimReward.propTypes = {
  account: PropTypes.string.isRequired,
};

export default ClaimReward;
