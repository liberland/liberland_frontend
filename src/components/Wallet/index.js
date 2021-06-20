import React from 'react';

import WalletAddressesLine from './WalletAddressesLine';
import styles from './styles.module.scss';
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';

const Wallet = () => (
  <div className={styles.walletWrapper}>
    <WalletAddressesLine />
    <WalletOverview />
    <WalletTransactionHistory />
  </div>
);

export default Wallet;
