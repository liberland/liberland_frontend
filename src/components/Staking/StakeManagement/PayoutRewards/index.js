import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import { PayoutStakingModal } from '../../../Modals';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';

export default function PayoutRewards() {
  const dispatch = useDispatch();
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);

  useEffect(() => {
    dispatch(validatorActions.getPendingRewards.call());
  }, [dispatch]);

  if (!pendingRewards?.gt(BN_ZERO)) return null;

  return (
    <PayoutStakingModal />
  );
}
