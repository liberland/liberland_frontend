import React from 'react';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

// eslint-disable-next-line max-len
const linkRaydium = 'https://raydium.io/liquidity/increase/?mode=add&pool_id=7fMyewrr7x2tLiNVGce7M3VTNiKzqQuriL1Gf3rv1PhR';

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
