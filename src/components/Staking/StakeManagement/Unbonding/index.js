import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import { formatDollars } from '../../../../utils/walletHelpers';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';
import { blockTimeFormatted, stakingInfoToProgress } from '../../../../utils/staking';
import { validatorActions } from '../../../../redux/actions';

function UnbondingRow({ unlock, blocks }) {
  return (
    <li>
      {formatDollars(unlock.value)}
      {' '}
      LLD
      {' '}
      {
       `will unlock in ${blockTimeFormatted(blocks)}`
      }
    </li>
  );
}

UnbondingRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  unlock: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  blocks: PropTypes.object.isRequired,
};

function UnbondingRowReady({ value }) {
  if (!value || value.lte(BN_ZERO)) return null;

  return (
    <li>
      {formatDollars(value)}
      {' '}
      LLD
      {' '}
      ready to withdraw
    </li>
  );
}

UnbondingRowReady.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object.isRequired,
};

export default function Unbonding({ info }) {
  const dispatch = useDispatch();
  const { stakingInfo, sessionProgress } = useSelector(validatorSelectors.stakingData);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const stakingData = stakingInfoToProgress(stakingInfo, sessionProgress) ?? [];

  useEffect(() => {
    if (info.unlocking.length === 0) return;
    dispatch(validatorActions.getStakingData.call());
  }, [dispatch, blockNumber, info]);

  if (stakingData.length === 0 && (!stakingInfo?.redeemable || stakingInfo?.redeemable.lte(BN_ZERO))) return null;
  return (
    <>
      Currently unstaking:
      <ul>
        <UnbondingRowReady value={stakingInfo?.redeemable} />
        {stakingData.map(({
          unlock,
          eras,
          blocks,
        }) => (
          <UnbondingRow
            key={eras.toString()}
            {...{ unlock, eras, blocks }}
          />
        ))}
      </ul>
    </>
  );
}

Unbonding.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  info: PropTypes.object.isRequired,
};
