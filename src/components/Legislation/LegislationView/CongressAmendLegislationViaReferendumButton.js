import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressAmendLegislationViaReferendumModal from '../../Modals/CongressAmendLegislationViaReferendumModal';
import { congressSelectors } from '../../../redux/selectors';

export default function CongressAmendLegislationViaReferendumButton({
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
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={toggle}>
        { add
          ? 'PROPOSE ADD SECTION REFERENDUM AS CONGRESS'
          : 'PROPOSE AMEND REFERENDUM AS CONGRESS'}
      </a>
      {isOpen
        && (
        <CongressAmendLegislationViaReferendumModal
          closeModal={toggle}
          {...{ tier, id, section }}
        />
        )}
    </>
  );
}

CongressAmendLegislationViaReferendumButton.defaultProps = {
  add: false,
};

CongressAmendLegislationViaReferendumButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  add: PropTypes.bool,
};
