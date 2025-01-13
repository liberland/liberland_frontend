import React from 'react';
import { Typography, Row, Col } from 'antd';
import Button from '../../Button/Button';

const { Title } = Typography;

const linkRaydium = 'https://raydium.io/clmm/create-position/?pool_id=2AXXcN6oN9bBT5owwmTH53C7QHUXvhLeu718Kqt8rvY2';

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
