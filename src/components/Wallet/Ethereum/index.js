import React from 'react';
import PropTypes from 'prop-types';
import { getAllWalletsList } from 'thirdweb/wallets';

function Ethereum({ onWalletSelected }) {
  return <div />;
}

Ethereum.propTypes = {
  onWalletSelected: PropTypes.func.isRequired,
};

export default Ethereum;
