import React, { useState } from 'react';
import Button from '../../Button/Button';
import { CongressProposeLegislationReferendumModal } from '../../Modals';

export default function ProposeLegislationReferendumButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <Button medium primary onClick={handleModalOpen}>
        Propose Referendum
      </Button>
      {isModalOpen && <CongressProposeLegislationReferendumModal closeModal={handleModalOpen} />}
    </div>
  );
}
