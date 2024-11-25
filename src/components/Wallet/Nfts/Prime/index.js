import React from 'react';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Alert from 'antd/es/alert';
import Paragraph from 'antd/es/typography/Paragraph';
import EthereumSelectorAddress from '../../EthereumSelectorAddress';
import EthereumSelectorWallet from '../../EthereumSelectorWallet';
import Mining from './Mining';
import Owned from './Owned';
import All from './All';
import Lookup from './Lookup';
import styles from './styles.module.scss';

function Prime() {
  const [selectedWallet, setSelectedWallet] = React.useState();
  const [selectedAccount, setSelectedAccount] = React.useState();

  const alert = (
    <Alert className={styles.noAccount} type="info" message="Select your wallet provider and ETH wallet first" />
  );

  return (
    <div className={styles.screen}>
      <Paragraph>
        <strong>NFT Prime</strong>
        {' '}
        is an innovative project combining mathematics, cryptography, and digital art to create unique value.
        Users generate large prime numbers of a specified size through an interactive platform,
        with each discovered prime unlocking the opportunity
        to mint a one-of-a-kind gradient NFT visually representing that number.
        These NFTs are not only collectible but also hold practical
        significance in advancing cryptographic research and mathematical exploration.
        A small fee on each NFT supports the development of Liberland,
        blending cutting-edge technology with the pursuit of freedom and progress.
        Join NFT Prime to turn numbers into art and innovation into impact.
      </Paragraph>
      <Flex gap="15px" wrap>
        <EthereumSelectorWallet
          onWalletSelected={setSelectedWallet}
        />
        <EthereumSelectorAddress
          selectedWallet={selectedWallet}
          onAccountSelected={setSelectedAccount}
          selectedAccount={selectedAccount}
        />
      </Flex>
      <Collapse
        defaultActiveKey={selectedAccount ? ['mine', 'all'] : ['all']}
        className={styles.operations}
        key={selectedAccount ? 'init' : 'idle'}
        items={[
          {
            key: 'mine',
            label: 'Mining options',
            children: !selectedAccount ? alert : <Mining account={selectedAccount} />,
          },
          {
            key: 'lookup',
            label: 'Lookup NFT by ID',
            children: <Lookup />,
          },
          {
            key: 'owned',
            label: 'Your NFT Primes',
            children: !selectedAccount ? alert : <Owned address={selectedAccount} />,
          },
          {
            key: 'all',
            label: 'All NFT Primes',
            children: <All />,
          },
        ]}
      />
    </div>
  );
}

export default Prime;
