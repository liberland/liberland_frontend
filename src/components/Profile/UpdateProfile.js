import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../redux/selectors';
import { identityActions } from '../../redux/actions';
import { OnchainIdentityModal } from '../Modals';

function UpdateProfile({
  toggleModalOnchainIdentity,
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
        dob.getFullYear() + 15,
        dob.getMonth(),
        dob.getDate(),
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
    toggleModalOnchainIdentity();
  };

  if (!identity || !blockNumber) return null;
  return (
    <OnchainIdentityModal
      closeModal={toggleModalOnchainIdentity}
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
  toggleModalOnchainIdentity: PropTypes.func.isRequired,
  userName: PropTypes.string,
  lastName: PropTypes.string,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
};

export default UpdateProfile;
