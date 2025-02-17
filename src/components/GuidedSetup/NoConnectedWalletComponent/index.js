import React from 'react';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import Link from 'antd/es/typography/Link';
import WalletListComponent from '../WalletListComponent';
import styles from './styles.module.scss';

function NoConnectedWalletComponent() {
  return (
    <Flex vertical>
      <Title className={styles.heading} level={2}>Register wallet</Title>
      <Paragraph>
        You do not yet have a connected wallet address on
        {' '}
        <Link href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</Link>
        .
      </Paragraph>
      <Paragraph>You can connect one of the detected wallets now</Paragraph>
      <WalletListComponent />
    </Flex>
  );
}

export default NoConnectedWalletComponent;
