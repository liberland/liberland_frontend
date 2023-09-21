import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import CongressRepealLegislationFastTrackModal from '../../Modals/CongressRepealLegislationFastTrackModal';
import {
  blockchainSelectors,
  congressSelectors,
} from '../../../redux/selectors';

export default function ProposeRepealLegislationButton({ tier, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  // requires parent to dispatch getMembers action
  const members = useSelector(congressSelectors.members);
  const user = useSelector(blockchainSelectors.userWalletAddressSelector);

  const userIsMember = members.map((m) => m.toString()).includes(user);
  if (!userIsMember) return null;

  return (
    <div>
      <Button small primary onClick={handleModalOpen}>
        Propose law repeal
      </Button>
      {isModalOpen && (
        <CongressRepealLegislationFastTrackModal
          closeModal={handleModalOpen}
          tier={tier}
          id={id}
        />
      )}
    </div>
  );
}

ProposeRepealLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
};
