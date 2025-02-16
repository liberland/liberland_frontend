import React from 'react';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

const linkRaydium = 'https://raydium.io/clmm/create-position/?pool_id=3gYXPAYp8xi7wrzC9hpa89d2pQ8jBqT1UUL5wehvz3LY';

export default function SOLLPStaking() {
  return (
    <Card
      title={(
        <Title className={styles.sol} level={2}>
          SOL LP Staking
        </Title>
      )}
    >
      <Button href={linkRaydium} primary newTab>
        Add liquidity on raydium
      </Button>
    </Card>
  );
}
