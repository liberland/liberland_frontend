import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressRepealLegislationFastTrackModal from '../../Modals/CongressRepealLegislationFastTrackModal';
import {
  congressSelectors,
} from '../../../redux/selectors';

export default function ProposeRepealLegislationButton({ tier, id, section }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  // requires parent to dispatch getMembers action
  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) return null;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={handleModalOpen}>
        PROPOSE REFERENDUM TO REPEAL
      </a>
      {isModalOpen && (
        <CongressRepealLegislationFastTrackModal
          closeModal={handleModalOpen}
          tier={tier}
          id={id}
          section={section}
        />
      )}
    </>
  );
}

ProposeRepealLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};
