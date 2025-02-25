import React from 'react';
import Result from 'antd/es/result';
import Flex from 'antd/es/flex';
import ExchangeList from './ExchangeList';

function Exchange() {
  return (
    <Flex vertical gap="20px">
      <Result
        status="warning"
        className="warning-result"
        title="Liberland DEX"
        subTitle={(
          <>
            Liberland DEX uses algorithmic market making which may not always be up to date with other exchanges.
            Arbitrage is possible.
            {' '}
            <a href="https://docs.liberland.org/blockchain/ecosystem/liberland-decentralized-exchange">
              Learn more
            </a>
          </>
        )}
      />
      <ExchangeList />
    </Flex>
  );
}

export default Exchange;
