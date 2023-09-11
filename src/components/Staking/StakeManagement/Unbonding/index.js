import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDollars } from '../../../../utils/walletHelpers';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';

function UnbondingRow({ value, era }) {
  const activeEra = useSelector(blockchainSelectors.activeEra);
  const ready = activeEra.index.gte(era.unwrap());

  return (
    <li>
      {formatDollars(value)}
      {' '}
      LLD
      {' '}
      {ready ? 'ready to withdraw' : `will unlock on Era ${era.toString()}`}
    </li>
  );
}

UnbondingRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  era: PropTypes.object.isRequired,
};

export default function Unbonding() {
  const info = useSelector(validatorSelectors.info);

  if (!info || info.unlocking.length <= 0) return null;

  return (
    <>
      Currently unstaking:
      <ul>
        {info.unlocking.map(({ value, era }) => <UnbondingRow key={era.toString()} {...{ value, era }} />)}
      </ul>
    </>
  );
}
