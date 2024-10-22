import React from 'react';
import Card from '../../Card';
import EthereumSelectorAddress from '../../Wallet/EthereumSelectorAddress';
import EthereumSelectorWallet from '../../Wallet/EthereumSelectorWallet';
import styles from './styles.module.scss';

export default function ETHLPStaking () {
  const [selectedWallet, setSelectedWallet] = React.useState();
  const [selectedAccount, setSelectedAccount] = React.useState();
  return (
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
      {selectedAccount}
    </Card>
  )
}
