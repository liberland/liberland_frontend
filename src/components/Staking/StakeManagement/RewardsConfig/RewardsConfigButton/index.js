import React, { useState } from 'react';
import { StakingRewardsDestinationModal } from '../../../../Modals';
import Button from '../../../../Button/Button';

export default function RewardsConfigButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Button small secondary onClick={handleModalOpen}>
        CHANGE DESTINATION
      </Button>
      {isModalOpen && <StakingRewardsDestinationModal closeModal={handleModalOpen} />}
    </>
  );
}
