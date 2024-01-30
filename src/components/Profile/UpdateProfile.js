import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../redux/selectors';
import { identityActions } from '../../redux/actions';
import { OnchainIdentityModal } from '../Modals';

function UpdateProfile({
  toggleModalOnchainIdentity, redirectAfterSubmit, userName, lastName, identity, blockNumber, walletAddress,
}) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const displayName = (userName && lastName) ? `${userName} ${lastName}` : '';

  const handleSubmitOnchainIdentity = (values) => {
    let eligible_on = null;

    if (values.older_than_15) {
      eligible_on = new Date(0);
    } else if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      eligible_on = new Date(dob.getFullYear() + 15, dob.getMonth(), dob.getDate());
    }

    const params = {
      display: values.display,
      legal: values.legal,
      web: values.web,
      email: values.email,
      onChainIdentity: values.onChainIdentity,
      eligible_on,
    };

    dispatch(identityActions.setIdentity.call({ userWalletAddress, values: params }));
    toggleModalOnchainIdentity();

    if (redirectAfterSubmit) {
      redirectAfterSubmit();
    }
  };

  useEffect(() => {
    dispatch(identityActions.getIdentity.call(walletAddress));
  }, [dispatch]);

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
};

UpdateProfile.propTypes = {
  toggleModalOnchainIdentity: PropTypes.func.isRequired,
  redirectAfterSubmit: PropTypes.func.isRequired,
  userName: PropTypes.string,
  lastName: PropTypes.string,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

export default UpdateProfile;
