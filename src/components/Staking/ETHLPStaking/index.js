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
            You can earn
            {' '}
            <strong>LLD rewards </strong>
            on Ethereum, by staking UniswapV2 LLD-ETH LP tokens which
            {' '}
            <a href="https://app.uniswap.org/add/v2/ETH/0x054c9d4c6f4ea4e14391addd1812106c97d05690">
              you can get here.
            </a>
            <br />
            {/* eslint-disable-next-line max-len */}
            <a href="https://docs.liberland.org/public-documents/blockchain/for-validators-nominators-and-stakers/liquidity-staking">
              Read the instructions for more details
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
