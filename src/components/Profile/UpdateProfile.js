import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../redux/selectors';
import { identityActions } from '../../redux/actions';
import OnchainIdentityForm from './OnchainIdentityForm';
import OpenModalButton from '../Modals/components/OpenModalButton';
import modalWrapper from '../Modals/components/ModalWrapper';

function UpdateProfile({
  onClose,
  userName,
  lastName,
  identity,
  blockNumber,
  isGuidedUpdate,
}) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const displayName = userName && lastName ? `${userName} ${lastName}` : '';

  const handleSubmitOnchainIdentity = (values) => {
    let eligible_on = null;

    if (values.older_than_15) {
      eligible_on = new Date(0);
    } else if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      eligible_on = new Date(
        dob.year() + 15,
        dob.month(),
        dob.date(),
      );
    }

    const params = {
      display: values.display,
      legal: values.legal,
      web: values.web,
      email: values.email,
      onChainIdentity: values.onChainIdentity,
      eligible_on,
    };

    dispatch(
      identityActions.setIdentity.call({ userWalletAddress, values: params, isGuidedUpdate }),
    );
    onClose();
  };

  if (!identity || !blockNumber) {
    return null;
  }

  return (
    <OnchainIdentityForm
      onClose={onClose}
      onSubmit={handleSubmitOnchainIdentity}
      identity={identity}
      blockNumber={blockNumber}
      name={displayName}
    />
  );
}

UpdateProfile.defaultProps = {
  userName: null,
  lastName: null,
  isGuidedUpdate: false,
};

UpdateProfile.propTypes = {
  isGuidedUpdate: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  userName: PropTypes.string,
  lastName: PropTypes.string,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
};

function ButtonModal(props) {
  return <OpenModalButton primary text="Update identity" {...props} />;
}

const UpdateProfileModal = modalWrapper(UpdateProfile, ButtonModal);

export default UpdateProfileModal;
