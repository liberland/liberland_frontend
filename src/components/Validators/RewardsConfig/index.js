import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../redux/selectors';
import RewardsConfigButton from './RewardsConfigButton';
import { validatorActions } from '../../../redux/actions';

export default function RewardsConfig() {
  const dispatch = useDispatch();
  const payee = useSelector(validatorSelectors.payee);

  useEffect(() => {
    dispatch(validatorActions.getPayee.call());
  }, [dispatch]);

  return (
    <div>
      Staking rewards destination:
      {' '}
      {payee?.toString()}
      <RewardsConfigButton />
    </div>
  );
}
