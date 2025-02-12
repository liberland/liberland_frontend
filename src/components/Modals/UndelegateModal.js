import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Button from '../Button/Button';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function UndelegateForm({
  onClose, delegatee, onSubmitUndelegate,
}) {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmitUndelegate(values);
        onClose();
      }}
    >
      <Title level={3}>Undelegate your votes</Title>
      <Paragraph>
        You&apos;re currently delegating your votes to
        {' '}
        {delegatee}
        .
      </Paragraph>
      <Flex wrap gap="15px">
        <Button
          medium
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Undelegate
        </Button>
      </Flex>
    </Form>
  );
}

UndelegateForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  delegatee: PropTypes.string.isRequired,
  onSubmitUndelegate: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton small primary text="Undelegate" {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

const UndelegateModal = modalWrapper(UndelegateForm, ButtonModal);

export default UndelegateModal;
