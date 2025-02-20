import React from 'react';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import Paragraph from 'antd/es/typography/Paragraph';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

// eslint-disable-next-line max-len
const linkRaydium = 'https://raydium.io/liquidity/increase/?mode=add&pool_id=7fMyewrr7x2tLiNVGce7M3VTNiKzqQuriL1Gf3rv1PhR';
// eslint-disable-next-line max-len
const instructions = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/sol-liquidity-staking';

export default function SOLLPStaking() {
  return (
    <>
      <Card
        title="Information"
        actions={[
          (
            <Button link href={instructions}>
              Read the instructions for more details.
            </Button>
          ),
        ]}
      >
        <Paragraph>
          You can earn
          {' '}
          <strong>LLD rewards </strong>
          on SOLana by providing SOL/LLD liquidity on Raydium.
          Being a liquidity provider allows people to trade against your pool, making LLD more stable
          and earning you trading fees alongside staking rewards.
        </Paragraph>
      </Card>
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
    </>

  );
}
