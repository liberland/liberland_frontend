import React from 'react';
import { useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Link from 'antd/es/typography/Link';
import Collapse from 'antd/es/collapse';
import WalletListComponent from '../WalletListComponent';
import { userSelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function MissingWalletComponent() {
  const registeredAddress = useSelector(userSelectors.selectWalletAddress);

  return (
    <Flex vertical gap="20px">
      <Flex vertical>
        <Title level={2}>Missing wallet</Title>
        <Paragraph>
          You already registered a wallet address but it is not available on this device
        </Paragraph>
        <Paragraph>
          The address you registered is:
          <div className="description">
            <CopyIconWithAddress address={registeredAddress} isTruncate />
          </div>
        </Paragraph>
        <Paragraph>
          Please log in with a browser or app that has this address available.
        </Paragraph>
        <Paragraph>
          Alternatively, you can register another address on
          {' '}
          <Link href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</Link>
          {' '}
          or contact support.
        </Paragraph>
        <Paragraph>
          If you are absolutely sure you want to change your wallet address to one available on this device,
          select wallet address from below
        </Paragraph>
      </Flex>
      <Collapse
        items={[{
          key: 'wallets',
          label: 'Wallets',
          children: (
            <WalletListComponent />
          ),
        }]}
      />
    </Flex>
  );
}

export default MissingWalletComponent;
