import React from 'react';
import Card from 'antd/es/card';
import Button from '../../Button/Button';

function Bridge() {
  const goToBridge = () => {
    const stakingLink = 'https://exchange.liberstake.ll.land/';
    window.open(stakingLink);
  };

  return (
    <Card
      title="Bridge"
      actions={[
        <Button primary onClick={() => goToBridge()}>
          Go to bridge
        </Button>,
      ]}
      extra={(
        <a
          href="https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge"
        >
          Learn more
        </a>
      )}
    >
      <Card.Meta
        description="Liberland chain is connected to other chains via Liberstake bridge."
      />
    </Card>
  );
}

export default Bridge;
