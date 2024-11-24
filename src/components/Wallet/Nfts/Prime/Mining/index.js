import React, { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Slider from 'antd/es/slider';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Switch from 'antd/es/switch';
import Miner from './Miner';

function Mining() {
  const [processes, setProcesses] = useState(1);
  const [isMining, setIsMining] = useState(false);
  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Paragraph>
          Discover prime number NFTs effortlessly with an intuitive browser-based UI.
          Adjust the
          {' '}
          <strong>number of parallel processes</strong>
          {' '}
          to optimize your search and flip a simple switch to start finding prime numbers.
          As the search progresses, prime numbers dynamically populate a sleek table in real time.
          Select any number from the table and mint your NFT instantly with a single click.
          The streamlined design ensures a fast, engaging, and user-friendly experience.
        </Paragraph>
      </Col>
      <Col span={isBiggerThanDesktop ? 15 : 24}>
        <Title level={4}>Number of parallel processes</Title>
        <Slider
          min={1}
          max={8}
          onChange={setProcesses}
          value={processes}
        />
      </Col>
      <Col span={isBiggerThanDesktop ? 7 : 24}>
        <Switch
          checkedChildren="Stop mining"
          unCheckedChildren="Start mining NFTs"
          checked={isMining}
          onChange={setIsMining}
        />
      </Col>
      <Col span={24}>
        <Miner />
      </Col>
    </Row>
  );
}

export default Mining;
