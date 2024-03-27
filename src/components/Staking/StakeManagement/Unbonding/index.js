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

function UnbondingRowReady({ value }) {
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
  const stakingData = useSelector(validatorSelectors.stakingData);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const activeEra = useSelector(blockchainSelectors.activeEra);

  useEffect(() => {
    if (info.unlocking.length === 0) return;
    dispatch(validatorActions.getStakingData.call());
  }, [dispatch, blockNumber, info]);

  if (
    !info?.unlocking
    || info?.unlocking.length === 0
  ) return null;

  return (
    <>
      Currently unstaking:
      <ul>
        {
        info.unlocking.map(({ era, value }) => (
          activeEra.index.gte(era)
            && <UnbondingRowReady key={era.toString()} {...{ value }} />
        ))
        }
        {stakingData && stakingData.map(({
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
