import React from 'react';
import Form from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { contractsActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';

export default function CreateContract({ isMyContracts, onClose }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const submit = (data) => {
    dispatch(
      contractsActions.createContract.call({
        data: data.contractData,
        parties: data.parties,
        isMyContracts,
      }),
    );
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={submit}>
      <Title level={3}>Create a new Contract</Title>
      <Form.Item
        name="contractData"
        label="Contract data"
        rules={[{ required: true, message: 'Contract data is required' }]}
      >
        <TextArea />
      </Form.Item>
      <Form.List name="parties">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item
                  name={field.name}
                  label={`Party user ${index + 1}`}
                  rules={[
                    { required: true, message: 'Party user is required' },
                  ]}
                >
                  <InputSearch />
                </Form.Item>
                <Button onClick={() => remove(field.name)} red>
                  <MinusCircleOutlined />
                  <Space />
                  Remove member
                </Button>
                <Divider />
              </div>
            ))}
            <Button onClick={add} green medium>
              <PlusCircleOutlined />
              <Space />
              Add party member
            </Button>
          </>
        )}
      </Form.List>
      <Divider />
      <Space>
        <Button onClick={onClose}>Cancel</Button>
        <Button primary type="submit">
          Submit
        </Button>
      </Space>
    </Form>
  );
}

CreateContract.propTypes = {
  isMyContracts: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
