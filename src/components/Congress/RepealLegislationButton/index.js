import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import CongressRepealLegislationModal from '../../Modals/CongressRepealLegislationModal';
import { blockchainSelectors, congressSelectors } from '../../../redux/selectors';

export default function RepealLegislationButton({ tier, index }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  // requires parent to dispatch getMembers action
  const members = useSelector(congressSelectors.members);
  const user = useSelector(blockchainSelectors.userWalletAddressSelector);

  const userIsMember = members.map((m) => m.toString()).includes(user);
  if (!userIsMember) return null;

  return (
    <>
      <Button medium primary onClick={handleModalOpen}>
        Propose Congress motion to repeal
      </Button>
      {isModalOpen && <CongressRepealLegislationModal closeModal={handleModalOpen} tier={tier} index={index} />}
    </>
  );
}

RepealLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
};
