import React from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import { registriesActions } from '../../redux/actions';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function DeleteCompanyForm({
  onClose, companyId,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={() => {
        dispatch(
          registriesActions.requestUnregisterCompanyRegistrationAction.call({
            companyId,
          }),
        );
        onClose();
      }}
    >
      <Title level={4}>
        Are you sure you want to request the deletion of company from the registrar?
      </Title>
      <Flex wrap gap="15px">
        <Button red type="submit">
          Yes
        </Button>
        <Button green onClick={onClose}>No</Button>
      </Flex>
    </Form>
  );
}

DeleteCompanyForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Request Deletion" {...props} />
  );
}
const DeleteCompanyModal = modalWrapper(DeleteCompanyForm, ButtonModal);

export default DeleteCompanyModal;
