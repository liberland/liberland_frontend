import React from 'react';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Alert from 'antd/es/alert';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Button from '../../Button/Button';
import StateBridge from './StateBridge';
import { useModeContext } from '../../AntdProvider';
import {
  BRIDGE_DOCS, HASHI_BRIDGE, INTRO, LLD_XOR_SWAP, PREREQUISITES, SOLANA_DOCS,
  SOLANA_NOTE, STEPS, TWO_HOPS, WARNINGS,
} from './content';

/*
 * How to use the HASHI bridge.
 *
 * The page used to be a single button pointing at a third-party exchange. It
 * now carries Liberland's own instructions and links to the officially
 * documented bridge, which the documentation is explicit about: use only the
 * announced interface, and no third-party service claiming to bridge for you.
 *
 * Both design languages show the same steps from the same source; only the
 * arrangement differs.
 */
function Bridge() {
  const { isStateDesign } = useModeContext();

  if (isStateDesign) {
    return <StateBridge />;
  }

  return (
    <Flex vertical gap="20px">
      <Card
        title="HASHI bridge"
        extra={<a href={BRIDGE_DOCS} target="_blank" rel="noopener noreferrer">Full guide</a>}
        actions={[
          <Flex wrap gap="15px" justify="start" style={{ padding: '0 24px' }}>
            <Button primary href={HASHI_BRIDGE} onClick={() => window.open(HASHI_BRIDGE)}>
              Open HASHI bridge
            </Button>
            <Button href={LLD_XOR_SWAP} onClick={() => window.open(LLD_XOR_SWAP)}>
              Swap LLD for XOR
            </Button>
          </Flex>,
        ]}
      >
        <Paragraph>{INTRO}</Paragraph>
        <Paragraph>{TWO_HOPS}</Paragraph>
      </Card>

      <Card title="Before you start">
        <List
          dataSource={PREREQUISITES}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>

      {STEPS.map((step, index) => (
        <Card key={step.title} title={`${index + 1}. ${step.title}`}>
          <List
            dataSource={step.body}
            renderItem={(line) => <List.Item>{line}</List.Item>}
          />
          {step.note ? <Paragraph type="secondary">{step.note}</Paragraph> : null}
        </Card>
      ))}

      <Alert
        type="warning"
        showIcon
        message="Use the official bridge only"
        description={(
          <ul>
            {WARNINGS.map((line) => <li key={line}>{line}</li>)}
          </ul>
        )}
      />

      <Card>
        <Title level={5}>Solana</Title>
        <Paragraph>
          {SOLANA_NOTE}
          {' '}
          <a href={SOLANA_DOCS} target="_blank" rel="noopener noreferrer">Read the Solana guide</a>
          .
        </Paragraph>
      </Card>
    </Flex>
  );
}

export default Bridge;
