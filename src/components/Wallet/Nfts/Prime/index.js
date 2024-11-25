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
import styles from './styles.module.scss';

function Prime() {
  const [selectedWallet, setSelectedWallet] = React.useState();
  const [selectedAccount, setSelectedAccount] = React.useState();

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
      {!selectedAccount ? (
        <Alert className={styles.noAccount} type="info" message="Select your wallet provider and ETH wallet first" />
      ) : (
        <Collapse
          defaultActiveKey={['mine', 'owned', 'score']}
          className={styles.operations}
          items={[
            {
              key: 'mine',
              label: 'Mining options',
              children: <Mining account={selectedAccount} />,
            },
            {
              key: 'owned',
              label: 'Your NFT Primes',
              children: <Owned address={selectedAccount} />,
            },
            {
              key: 'score',
              label: 'All NFT Primes',
              children: <All />,
            },
          ]}
        />
      )}
    </div>
  );
}

export default Prime;
