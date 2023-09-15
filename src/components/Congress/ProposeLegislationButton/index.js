import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import CongressProposeLegislationModal from '../../Modals/CongressProposeLegislationModal';
import { blockchainSelectors, congressSelectors } from '../../../redux/selectors';

export default function ProposeLegislationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);
  // requires parent to dispatch getCongressMembers action
  const members = useSelector(congressSelectors.congressMembers);
  const user = useSelector(blockchainSelectors.userWalletAddressSelector);

  const userIsMember = members.includes(user);
  if (!userIsMember) return null;

  return (
    <div>
      <Button medium primary onClick={handleModalOpen}>
        Propose International Treaty
      </Button>
      {isModalOpen && <CongressProposeLegislationModal closeModal={handleModalOpen} />}
    </div>
  );
}
