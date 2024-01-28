import React from 'react';
import WalletListComponent from '../WalletListComponent';
import { propsWalletListUserID } from '../propsTypes/propTypes';

function NoConnectedWalletComponent({ walletList, userId }) {
  return (
    <div>
      <h2>Register wallet</h2>
      <p>
        You do not yet have a connected wallet address on
        {' '}
        <a href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</a>
        .
      </p>
      <br />
      <p>You can connect one of the detected wallets now</p>
      <br />
      <WalletListComponent walletList={walletList} userId={userId} />
    </div>
  );
}

NoConnectedWalletComponent.propTypes = propsWalletListUserID;

export default NoConnectedWalletComponent;
