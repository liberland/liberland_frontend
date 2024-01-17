import PropTypes from 'prop-types';

export const proposWalletListUserID = {
  walletList: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string.isRequired,
  })).isRequired,
  userId: PropTypes.string.isRequired,
};

export const proposMissingWallet = {
  walletList: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string.isRequired,
  })).isRequired,
  userId: PropTypes.string.isRequired,
  registeredAddress: PropTypes.string.isRequired,
};
