import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressAmendLegislationModal from '../../Modals/CongressAmendLegislationModal';
import Button from '../../Button/Button';
import { blockchainSelectors, congressSelectors } from '../../../redux/selectors';

export default function CongressAmendLegislationButton({
  tier, id, section, add,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // FIXME refactor after https://github.com/liberland/liberland_frontend/pull/143 is merged
  const members = useSelector(congressSelectors.members);
  const user = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userIsMember = members.find((member) => member.toString() === user);
  if (!userIsMember) return null;

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button medium primary onClick={toggle}>{ add ? 'Add Section as Congress' : 'Amend as Congress' }</Button>
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
