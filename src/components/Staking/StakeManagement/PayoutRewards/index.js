import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { BN_ZERO } from '@polkadot/util';
import { ChoseStakeModal } from '../../../Modals';
import { validatorSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';

export default function PayoutRewards() {
  const dispatch = useDispatch();
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all',
  });

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);
  const handleSubmitPayout = () => {
    dispatch(validatorActions.payout.call());
    handleModalOpen();
  };

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
        <ChoseStakeModal
          closeModal={handleModalOpen}
          handleSubmit={handleSubmit}
          register={register}
          modalShown={4}
          setModalShown={() => {}}
          handleSubmitPayout={handleSubmitPayout}
          errors={errors}
        />
      )}
    </>
  );
}
