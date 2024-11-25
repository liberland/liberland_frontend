import React, { useState } from 'react';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Form from 'antd/es/form';
import Button from '../../../../Button/Button';
import { createGradient } from '../Mining/utils';
import { getNftPrime } from '../../../../../api/ethereum';
import styles from '../styles.module.scss';

function Lookup() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [form] = Form.useForm();

  const onFinish = async ({ id }) => {
    setLoading(true);
    const setError = () => form.setFields([
      {
        name: 'id',
        errors: ['No NFT found'],
      },
    ]);

    try {
      const nft = await getNftPrime({ id });
      if (!nft) {
        setError();
      } else {
        setData({ ...nft, id });
      }
    } catch {
      setError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Flex vertical gap="15px">
        {data && (
          <Card
            hoverable
            bordered={false}
            className={styles.card}
            cover={<div style={createGradient(data.val)} />}
          >
            <Card.Meta title={`NFT Prime ${data.id}`} />
          </Card>
        )}
        <Form.Item
          name="id"
          label="NFT Prime ID"
          rules={[{ required: true }, { type: 'number', min: 0 }]}
          disabled={loading}
          wrapperCol={{ span: 6 }}
        >
          <InputNumber placeholder="ID" />
        </Form.Item>
        <Form.Item>
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Show NFT'}
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
}

export default Lookup;
