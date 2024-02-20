import PropTypes from 'prop-types';

export const propsWalletListUserID = {
  walletList: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string.isRequired,
  })).isRequired,
  userId: PropTypes.string.isRequired,
};
