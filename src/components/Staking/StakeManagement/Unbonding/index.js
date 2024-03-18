import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { formatDollars } from '../../../../utils/walletHelpers';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';
import { blockTimeFormatted } from '../../../../utils/staking';
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

export default function Unbonding({ info }) {
  const dispatch = useDispatch();
  const stakingData = useSelector(validatorSelectors.stakingData);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);

  useEffect(() => {
    if (info.unlocking.length === 0) return;
    dispatch(validatorActions.getStakingData.call());
  }, [dispatch, blockNumber, info]);

  if (!stakingData || stakingData.length <= 0) return null;

  return (
    <>
      Currently unstaking:
      <ul>
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
