import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import { PayoutStakingModal } from '../../../Modals';
import { validatorSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';

export default function PayoutRewards() {
  const dispatch = useDispatch();
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    dispatch(validatorActions.getPendingRewards.call());
  }, [dispatch]);

  if (!pendingRewards?.gt(BN_ZERO)) return null;

  return (
    <>
      <Button small secondary onClick={handleModalOpen}>
        Payout rewards
      </Button>

      {isModalOpen && (
        <PayoutStakingModal closeModal={handleModalOpen} />
      )}
    </>
  );
}
