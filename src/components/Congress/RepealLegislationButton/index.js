import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressRepealLegislationModal from '../../Modals/CongressRepealLegislationModal';
import { congressSelectors } from '../../../redux/selectors';

export default function RepealLegislationButton({ tier, id, section }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  // requires parent to dispatch getMembers action
  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) return null;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={handleModalOpen}>
        PROPOSE CONGRESS MOTION TO REPEAL
      </a>
      {isModalOpen && (
      <CongressRepealLegislationModal
        closeModal={handleModalOpen}
        tier={tier}
        id={id}
        section={section}
      />
      )}
    </>
  );
}

RepealLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};
