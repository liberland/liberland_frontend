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
      actions={[
        <Button link onClick={() => goToHashiBridge()}>
          Bridge
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
        title="Bridge"
        description="Liberland chain is connected to other chains via SORA HASHI bridge."
      />
    </Card>
  );
}

export default Bridge;
