import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { walletSelectors } from '../../redux/selectors';
import { walletActions } from '../../redux/actions';

import WalletAddressesLine from './WalletAddressesLine';
import styles from './styles.module.scss';
import WalletOverview from './WalletOverview';
import WalletTransactionHistory from './WalletTransactionHistory';
import Card from '../Card';

const Wallet = () => {
  const dispatch = useDispatch();
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <>
      { (walletInfo !== undefined) ? (
        <div className={styles.walletWrapper}>
          <WalletAddressesLine walletAddress={walletInfo.address} />
          <WalletOverview />
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
