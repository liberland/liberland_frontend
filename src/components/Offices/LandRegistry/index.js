import React from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import TextArea from 'antd/es/input/TextArea';
import InputSearch from '../../InputComponents/InputSearchAddressName';
import Button from '../../Button/Button';
import { setLandNFTMetadata } from '../../../api/nodeRpcCall';

function LandRegistry() {
  const [form] = Form.useForm();

  const onSubmit = ({
    sign_with_address,
    collection_id,
    nft_id,
    metadata_json,
  }) => {
    setLandNFTMetadata(collection_id, nft_id, JSON.parse(metadata_json), sign_with_address);
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <Title level={3}>Set metadata for NFT</Title>
      <Form.Item
        name="sign_with_address"
        label="Clerk address to sign with"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        name="collection_id"
        label="Collection ID"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="nft_id"
        label="NFT ID"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="metadata_json"
        label="Metadata JSON"
        extra={(
          <>
            Example:
            {' '}
            <pre>
              {`{
                "demarcation": [
                  {"lat":45.7723532,"long":18.8870918},{"lat":45.7721717,"long":18.8871917},
                  {"lat":45.772333,"long":18.8877504},{"lat":45.7724976,"long":18.8876859},
                  {"lat":45.7725234,"long":18.8876738},{"lat":45.7723532,"long":18.8870918}
                ],
                "type":"residential",
                "status":"undeveloped"
              }`}
            </pre>
          </>
        )}
      >
        <TextArea />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          primary
          type="submit"
        >
          Set Metadata
        </Button>
      </Flex>
    </Form>
  );
}

export default LandRegistry;
