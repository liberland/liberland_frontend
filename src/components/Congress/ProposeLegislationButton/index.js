import React, { useState } from 'react';
import Button from '../../Button/Button';
import CongressProposeLegislationModal from '../../Modals/CongressProposeLegislationModal';

export default function ProposeLegislationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <Button medium primary onClick={handleModalOpen}>
        Propose International Treaty
      </Button>
      {isModalOpen && <CongressProposeLegislationModal closeModal={handleModalOpen} />}
    </div>
  );
}
