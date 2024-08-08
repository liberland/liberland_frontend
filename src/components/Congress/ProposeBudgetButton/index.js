import React, { useState } from 'react';
import Button from '../../Button/Button';
import ProposeBudgetModalWrapper from '../../Modals/ProposeBudgetModal';

export default function ProposeBudgetButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen((prevValue) => !prevValue);
  };

  return (
    <>
      <Button small primary onClick={handleModal}>
        Propose budget
      </Button>
      {isModalOpen && <ProposeBudgetModalWrapper closeModal={handleModal} />}
    </>
  );
}
