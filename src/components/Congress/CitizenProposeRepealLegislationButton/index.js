import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import CitizenRepealLegislationModal from '../../Modals/CitizenRepealLegislationModal';
import {
  congressSelectors,
} from '../../../redux/selectors';

export default function CitizenProposeRepealLegislationButton({ tier, id, section }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  // requires parent to dispatch getMembers action
  const userIsMember = useSelector(congressSelectors.userIsMember);

  if (!userIsMember) return null;

  return (
    <>
      <Button small primary onClick={handleModalOpen}>
        PROPOSE CITIZEN REFERENDUM TO REPEAL
      </Button>
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
