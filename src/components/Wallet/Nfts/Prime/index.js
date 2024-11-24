import React from 'react';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Alert from 'antd/es/alert';
import EthereumSelectorAddress from '../../EthereumSelectorAddress';
import EthereumSelectorWallet from '../../EthereumSelectorWallet';
import Mining from './Mining';
import Owned from './Owned';
import All from './All';

function Prime() {
  const [selectedWallet, setSelectedWallet] = React.useState();
  const [selectedAccount, setSelectedAccount] = React.useState();

  return (
    <>
      <Flex gap="15px">
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
        <Alert type="info" message="Select your wallet provider and ETH wallet first" />
      ) : (
        <Collapse
          defaultActiveKey={['mine', 'owned', 'score']}
          items={[
            {
              key: 'mine',
              label: 'Mining options',
              children: <Mining />,
            },
            {
              key: 'owned',
              label: 'Your NFT Primes',
              children: <Owned />,
            },
            {
              key: 'score',
              label: 'All NFT Primes',
              children: <All />,
            },
          ]}
        />
      )}
    </>
  );
}

export default Prime;
