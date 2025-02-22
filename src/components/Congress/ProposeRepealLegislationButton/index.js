import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  congressSelectors,
} from '../../../redux/selectors';
import OpenModalButton from '../../Modals/components/OpenModalButton';
import modalWrapper from '../../Modals/components/ModalWrapper';
import CongressRepealLegislationFastTrackForm from '../../Modals/CongressRepealLegislationFastTrackModal';

function ButtonModal(props) {
  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) {
    return null;
  }
  return (
    <OpenModalButton text="Propose referendum to repeal" {...props} />
  );
}

ButtonModal.propTypes = {
  add: PropTypes.bool,
};

const ProposeRepealLegislationButton = modalWrapper(CongressRepealLegislationFastTrackForm, ButtonModal);

export default ProposeRepealLegislationButton;
