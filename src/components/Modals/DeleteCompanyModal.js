import React, { useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { registriesActions } from '../../redux/actions';

function DeleteCompanyModal({
  closeModal, companyId,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFinish={() => {
        dispatch(
          registriesActions.requestUnregisterCompanyRegistrationAction.call({
            companyId,
          }),
        );
        closeModal();
      }}
    >
      <Title level={4}>
        Are you sure you want to request the deletion of company from the registrar?
      </Title>
      <Flex wrap gap="15px">
        <Button red type="submit">
          Yes
        </Button>
        <Button green onClick={closeModal}>No</Button>
      </Flex>
    </Form>
  );
}

DeleteCompanyModal.propTypes = {
  companyId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

function DeleteCompanyModalWrapper({
  companyId,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        red
        small
        onClick={() => setShow(true)}
      >
        Request Deletion
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <DeleteCompanyModal
            closeModal={() => setShow(false)}
            companyId={companyId}
          />
        </ModalRoot>
      )}
    </>
  );
}

DeleteCompanyModalWrapper.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default DeleteCompanyModalWrapper;
