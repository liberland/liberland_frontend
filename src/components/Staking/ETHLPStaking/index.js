import React from 'react';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import EthereumSelectorAddress from '../../Wallet/EthereumSelectorAddress';
import EthereumSelectorWallet from '../../Wallet/EthereumSelectorWallet';
import TokenStakeInfo from './TokenStakeInfo';
import styles from './styles.module.scss';

export default function ETHLPStaking() {
  const [selectedWallet, setSelectedWallet] = React.useState();
  const [selectedAccount, setSelectedAccount] = React.useState();
  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card title="Info" className={styles.card}>
          <p className={styles.info}>
            To earn
            {' '}
            <strong>LLD rewards</strong>
            , purchase
            {' '}
            <strong>LP tokens</strong>
            {' '}
            with ETH and stake them in our pool.
            For more details about the LP token, check the
            {' '}
            <a href="https://etherscan.io/address/0x8bafc89114d5f5B78806C0c84e465394Cb35f5Ea">
              LP contract on Etherscan
            </a>
            .
          </p>
        </Card>
        <Card title="ETH LP staking" className={styles.card}>
          <div className={styles.selector}>
            <EthereumSelectorWallet
              onWalletSelected={setSelectedWallet}
            />
          </div>
          <div className={styles.selector}>
            <EthereumSelectorAddress
              selectedWallet={selectedWallet}
              onAccountSelected={setSelectedAccount}
              selectedAccount={selectedAccount}
            />
          </div>
          <TokenStakeInfo selectedAccount={selectedAccount} />
        </Card>
      </div>
    </div>
  );
}
