import React from 'react';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card/Card';
import Paragraph from 'antd/es/typography/Paragraph';
import Form from 'antd/es/form';
import Divider from 'antd/es/divider';
import Link from 'antd/es/typography/Link';
import Flex from 'antd/es/flex';
import EthereumSelectorAddress from '../../Wallet/EthereumSelectorAddress';
import EthereumSelectorWallet from '../../Wallet/EthereumSelectorWallet';
import TokenStakeInfo from './TokenStakeInfo';

export default function ETHLPStaking() {
  // eslint-disable-next-line max-len
  const instructions = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/eth-liquidity-staking';
  const lldOnEth = 'https://app.uniswap.org/explore/tokens/ethereum/0x054c9d4c6f4ea4e14391addd1812106c97d05690';

  const [form] = Form.useForm();
  const selectedWallet = Form.useWatch('selectedWallet', form);
  const selectedAccount = Form.useWatch('selectedAccount', form);

  return (
    <Form form={form} layout="vertical">
      <Title level={2}>
        ETH LP Staking
      </Title>
      <Card title="Information">
        <Flex vertical gap="20px" justify="space-between" align="center">
          <Paragraph>
            You can earn
            {' '}
            <strong>LLD rewards </strong>
            on Ethereum by providing ETH/LLD liquidity on UniswapV2.
            Here you can stake your Liquidity Pool tokens if you already have them,
            or directly create one and stake your ETH and LLD.
            Being a liquidity provider allows people to trade against your pool, making LLD more stable
            and earning you trading fees alongside staking rewards.
            {' '}
            <Link href={lldOnEth}>
              Buy LLD on ETH here.
            </Link>
            {' '}
            or
            {' '}
            <Link href="https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge">
              Bridge LLD.
            </Link>
          </Paragraph>
          <Link href={instructions}>
            Learn more
          </Link>
        </Flex>
      </Card>
      <Divider />
      <EthereumSelectorWallet />
      <EthereumSelectorAddress
        selectedWallet={selectedWallet}
        selectedAccount={selectedAccount}
        form={form}
      />
      <Divider />
      <TokenStakeInfo selectedAccount={selectedAccount} />
    </Form>
  );
}
