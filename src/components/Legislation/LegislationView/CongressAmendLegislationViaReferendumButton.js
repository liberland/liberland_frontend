import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CongressAmendLegislationViaReferendumModal from '../../Modals/CongressAmendLegislationViaReferendumModal';
import Button from '../../Button/Button';
import { blockchainSelectors, congressSelectors } from '../../../redux/selectors';

export default function CongressAmendLegislationViaReferendumButton({
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
      <Button medium primary onClick={toggle}>
        { add
          ? 'Propose Add Section Referendum as Congress'
          : 'Propose Amend Referendum as Congress'}
      </Button>
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
