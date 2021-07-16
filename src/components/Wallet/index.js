import React from 'react';
import { useSelector } from 'react-redux';

import { walletSelectors } from '../../redux/selectors';

import WalletAddressesLine from './WalletAddressesLine';
import styles from './styles.module.scss';
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';
import Card from '../Card';

const Wallet = () => {
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  const balances = useSelector(walletSelectors.selectorBalances);
  const totalBalance = useSelector(walletSelectors.selectorTotalBalance);

  return (
    <>
      { (walletInfo !== undefined) ? (
        <div className={styles.walletWrapper}>
          <WalletAddressesLine walletAddress={walletInfo.address} />
          <WalletOverview
            totalBalance={totalBalance}
            balances={balances}
          />
          <WalletTransactionHistory />
        </div>
      ) : (
        <Card>
          <div className={styles.haveNotExtension}>
            <span>
              No extension installed, or you did not accept the authorization, please visit
              {' '}
              <a target="_blank" href="https://polkadot.js.org/extension/" rel="noopener noreferrer">polkadot.js.org</a>
              {' '}
              for more details.
            </span>
          </div>
        </Card>
      )}
    </>
  );
};

export default Wallet;
