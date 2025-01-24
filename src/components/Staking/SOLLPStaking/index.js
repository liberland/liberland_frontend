import React from 'react';
import Title from 'antd/es/typography/Title';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Button from '../../Button/Button';

const linkRaydium = 'https://raydium.io/clmm/create-position/?pool_id=3gYXPAYp8xi7wrzC9hpa89d2pQ8jBqT1UUL5wehvz3LY';

export default function SOLLPStaking() {
  return (
    <Row>
      <Col>
        <Title level={2}>
          SOL LP Staking
        </Title>
        <Button link href={linkRaydium} primary large newTab>
          Add liquidity on raydium
        </Button>
      </Col>
    </Row>
  );
}
