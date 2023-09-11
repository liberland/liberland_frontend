import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';

export default function WithdrawUnbondedButton() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const activeEra = useSelector(blockchainSelectors.activeEra);

  if (!info || info.unlocking.length <= 0) return null;

  const anyReady = info.unlocking.some(({ era }) => activeEra.index.gte(era.unwrap()));
  if (!anyReady) return null;

  const withdrawUnbonded = () => {
    dispatch(validatorActions.withdrawUnbonded.call());
  };

  return <Button primary small onClick={withdrawUnbonded}>Withdraw unlocked</Button>;
}
