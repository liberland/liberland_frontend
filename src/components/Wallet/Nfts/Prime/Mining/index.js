import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Slider from 'antd/es/slider';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Switch from 'antd/es/switch';
import Miner from './Miner';
import styles from '../styles.module.scss';

function Mining({ account }) {
  const [processes, setProcesses] = useState(1);
  const [isMining, setIsMining] = useState(false);

  return (
    <Row gutter={[24, 24]}>
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
      <Col span={24}>
        <Title level={4}>Start mining</Title>
        <Switch
          checkedChildren="Stop mining"
          unCheckedChildren="Start mining NFTs"
          checked={isMining}
          onChange={setIsMining}
        />
      </Col>
      <Col span={24}>
        <Title level={5}>Number of parallel processes</Title>
        <Slider
          min={1}
          max={8}
          className={styles.processes}
          marks={new Array(8).fill(0).map((_, i) => i + 1).reduce((p, c) => ({ ...p, [c]: c }), {})}
          onChange={setProcesses}
          value={processes}
        />
      </Col>
      <Col span={24}>
        <Miner account={account} processes={processes} isActive={isMining} />
      </Col>
    </Row>
  );
}

Mining.propTypes = {
  account: PropTypes.string.isRequired,
};

export default Mining;
