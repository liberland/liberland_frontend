import React from 'react';
import Card from 'antd/es/card';
import Button from '../../Button/Button';

function Bridge() {
  const goToHashiBridge = () => {
    const stakingLink = 'https://polkaswap.io/#/bridge/';
    window.open(stakingLink);
  };

  return (
    <Card
      title="Bridge"
      actions={[
        <Button primary onClick={() => goToHashiBridge()}>
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
        description="Liberland chain is connected to other chains via SORA HASHI bridge."
      />
    </Card>
  );
}

export default Bridge;
