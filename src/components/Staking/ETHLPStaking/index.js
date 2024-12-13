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
  // eslint-disable-next-line max-len
  const instructions = 'https://docs.liberland.org/public-documents/blockchain/for-validators-nominators-and-stakers/liquidity-staking';
  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card title="Info" className={styles.card}>
          <p className={styles.info}>
            You can earn
            {' '}
            <strong>LLD rewards </strong>
            on Ethereum by providing ETH/LLD liquidity on UniswapV2.
            {' '}
            Here you can stake your Liquidity Pool tokens if you already have them,
            or directly create one and stake your ETH and LLD.
            <br />
            Being a liquidity provider allows people to trade against your pool, making LLD more stable
            and earning you trading fees alongside staking rewards.
            <br />
            <a href="https://app.uniswap.org/explore/tokens/ethereum/0x054c9d4c6f4ea4e14391addd1812106c97d05690">
              Buy LLD on ETH here.
            </a>
            <br />
            or
            <br />
            <a href="https://docs.liberland.org/public-documents/blockchain/ecosystem/cross-chain-bridge">
              Bridge LLD.
            </a>
            <br />
            <a href={instructions}>
              Read the instructions for more details.
            </a>
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
