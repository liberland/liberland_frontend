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

function CancelCompanyRequestForm({
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
          registriesActions.cancelCompanyRequest.call({
            companyId,
          }),
        );
        onClose();
      }}
    >
      <Title level={4}>
        Are you sure you want to cancel company request?
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

CancelCompanyRequestForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Delete request" red {...props} />
  );
}
const CancelCompanyRequestModal = modalWrapper(CancelCompanyRequestForm, ButtonModal);

export default CancelCompanyRequestModal;
