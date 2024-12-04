import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProposeAmendLegislationModal from '../../Modals/ProposeAmendLegislationModal';

export default function AmendLegislationButton({
  tier, id, section, add,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={toggle}>{ add ? 'ADD SECTION' : 'AMEND'}</a>
      {isOpen && <ProposeAmendLegislationModal closeModal={toggle} {...{ tier, id, section }} />}
    </>
  );
}

AmendLegislationButton.defaultProps = {
  add: false,
};

AmendLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  add: PropTypes.bool,
};
