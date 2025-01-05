import React, { useState } from 'react';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import EthereumSelectorAddress from '../../Wallet/EthereumSelectorAddress';
import EthereumSelectorWallet from '../../Wallet/EthereumSelectorWallet';
import TokenStakeInfo from './TokenStakeInfo';

export default function ETHLPStaking() {
  const [selectedWallet, setSelectedWallet] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  // eslint-disable-next-line max-len
  const instructions = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/liquidity-staking';
  return (
    <Collapse
      defaultActiveKey={['info', 'staking']}
      items={[
        {
          key: 'info',
          label: 'Info',
          children: (
            <Paragraph>
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
              <a href="https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge">
                Bridge LLD.
              </a>
              <br />
              <a href={instructions}>
                Read the instructions for more details.
              </a>
            </Paragraph>
          ),
        },
        {
          key: 'staking',
          label: 'ETH LP staking',
          children: (
            <Flex gap="20px" vertical>
              <EthereumSelectorWallet
                onWalletSelected={setSelectedWallet}
              />
              <EthereumSelectorAddress
                selectedWallet={selectedWallet}
                onAccountSelected={setSelectedAccount}
                selectedAccount={selectedAccount}
              />
              <TokenStakeInfo selectedAccount={selectedAccount} />
            </Flex>
          ),
        },
      ]}
    />
  );
}
