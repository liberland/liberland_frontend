import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressAmendLegislationModal from '../../Modals/CongressAmendLegislationModal';
import Button from '../../Button/Button';
import { congressSelectors } from '../../../redux/selectors';

export default function CongressAmendLegislationButton({
  tier, id, section, add,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) return null;

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button small primary onClick={toggle}>{ add ? 'Add Section as Congress' : 'Amend as Congress' }</Button>
      {isOpen && <CongressAmendLegislationModal closeModal={toggle} {...{ tier, id, section }} />}
    </>
  );
}
CongressAmendLegislationButton.defaultProps = {
  add: false,
};

CongressAmendLegislationButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  add: PropTypes.bool,
};
