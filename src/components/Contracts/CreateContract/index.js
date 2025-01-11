import React, { useState } from 'react';
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
import ModalRoot from '../../Modals/ModalRoot';
import InputSearch from '../../InputComponents/InputSearchAddressName';

function CreateContract({ handleModal, isMyContracts }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const submit = (data) => {
    dispatch(contractsActions.createContract.call({
      data: data.contractData,
      parties: data.parties,
      isMyContracts,
    }));
    handleModal();
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
          onClick={handleModal}
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
  handleModal: PropTypes.func.isRequired,
  isMyContracts: PropTypes.bool.isRequired,
};

function CreateContractModalWrapper({
  isMyContracts,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        onClick={() => setShow(true)}
        primary
      >
        Create Contract
      </Button>
      {show && (
        <ModalRoot>
          <CreateContract
            handleModal={() => setShow(false)}
            isMyContracts={isMyContracts}
          />
        </ModalRoot>
      )}
    </>
  );
}

CreateContractModalWrapper.propTypes = {
  isMyContracts: PropTypes.bool.isRequired,
};

export default CreateContractModalWrapper;
