import React from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import ModalRoot from './ModalRoot';

function LogoutModal({ closeModal, handleLogout }) {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      onFinish={handleLogout}
    >
      <Flex wrap gap="15px">
        <Button red onClick={handleLogout}>
          Logout
        </Button>
        <Button primary onClick={closeModal}>
          Cancel
        </Button>
      </Flex>
    </Form>
  );
}

LogoutModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

function LogoutModalWrapper(props) {
  return (
    <ModalRoot>
      <LogoutModal {...props} />
    </ModalRoot>
  );
}

export default LogoutModalWrapper;
