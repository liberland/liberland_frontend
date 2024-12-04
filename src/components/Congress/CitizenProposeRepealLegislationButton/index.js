import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CitizenRepealLegislationModal from '../../Modals/CitizenRepealLegislationModal';

export default function CitizenProposeRepealLegislationButton({ tier, id, section }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={handleModalOpen}>
        PROPOSE CITIZEN REFERENDUM TO REPEAL
      </a>
      {isModalOpen && (
        <CitizenRepealLegislationModal
          closeModal={handleModalOpen}
          tier={tier}
          id={id}
          section={section}
        />
      )}
    </>
  );
}

CitizenProposeRepealLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};
