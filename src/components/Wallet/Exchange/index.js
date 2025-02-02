import React from 'react';
import Alert from 'antd/es/alert';
import Flex from 'antd/es/flex';
import ExchangeList from './ExchangeList';

function Exchange() {
  return (
    <Flex vertical gap="20px">
      <Alert
        message={(
          <>
            Liberland DEX uses algorithmic market making which may not always be up to date with other exchanges.
            Arbitrage is possible.
            {' '}
            <a href="https://docs.liberland.org/blockchain/ecosystem/liberland-decentralized-exchange">
              Learn more
            </a>
          </>
        )}
        type="warning"
      />
      <ExchangeList />
    </Flex>
  );
}

export default Exchange;
