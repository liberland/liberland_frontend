import React from 'react';
import Form from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Flex from 'antd/es/flex';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { contractsActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import InputSearch from '../../InputComponents/InputSearchAddressName';
import { useModal } from '../../../context/modalContext';

export default function CreateContract({ isMyContracts }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { closeModal } = useModal();
  const submit = (data) => {
    dispatch(contractsActions.createContract.call({
      data: data.contractData,
      parties: data.parties,
      isMyContracts,
    }));
    closeModal();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={submit}
    >
      <Title level={3}>Create a new Contract</Title>
      <Form.Item
        name="contractData"
        label="Contract data"
        rules={[{ required: true }]}
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
                >
                  <InputSearch />
                </Form.Item>
                <Button
                  onClick={() => remove(field.name)}
                  red
                >
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
      <Flex wrap gap="15px">
        <Button
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

CreateContract.propTypes = {
  isMyContracts: PropTypes.bool.isRequired,
};
