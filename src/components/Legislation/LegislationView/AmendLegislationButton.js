import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProposeAmendLegislationModal from '../../Modals/ProposeAmendLegislationModal';
import Button from '../../Button/Button';

export default function AmendLegislationButton({
  tier, id, section, add,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button medium primary onClick={toggle}>{ add ? 'Add Section' : 'Amend Legislation'}</Button>
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
