import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../redux/selectors';
import { identityActions } from '../../redux/actions';
import { OnchainIdentityModal } from '../Modals';
import Button from '../Button/Button';

function UpdateProfile({
  closeModal,
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
    closeModal();
  };

  if (!identity || !blockNumber) {
    return null;
  }

  return (
    <OnchainIdentityModal
      closeModal={closeModal}
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
  closeModal: PropTypes.func.isRequired,
  userName: PropTypes.string,
  lastName: PropTypes.string,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
};

function UpdateProfileWrapper({
  userName,
  lastName,
  identity,
  blockNumber,
  isGuidedUpdate,
}) {
  const [show, setShow] = useState();

  return (
    <>
      <Button
        primary
        onClick={() => setShow(true)}
      >
        Update identity
      </Button>
      {show && (
        <UpdateProfile
          blockNumber={blockNumber}
          closeModal={() => setShow(false)}
          identity={identity}
          isGuidedUpdate={isGuidedUpdate}
          lastName={lastName}
          userName={userName}
        />
      )}
    </>
  );
}

UpdateProfileWrapper.propTypes = {
  isGuidedUpdate: PropTypes.bool,
  userName: PropTypes.string,
  lastName: PropTypes.string,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
};

export default UpdateProfileWrapper;
