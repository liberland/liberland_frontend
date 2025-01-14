import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';

function UndelegateModal({
  closeModal, delegatee, onSubmitUndelegate,
}) {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmitUndelegate(values);
        closeModal();
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
          onClick={closeModal}
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

UndelegateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  delegatee: PropTypes.string.isRequired,
  onSubmitUndelegate: PropTypes.func.isRequired,
};

function UndelegateModalWrapper({
  delegatee,
  onSubmitUndelegate,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        small
        primary
        onClick={() => setShow(true)}
      >
        Undelegate
      </Button>
      <ModalRoot onClose={() => setShow(false)}>
        {show && (
          <UndelegateModal
            delegatee={delegatee}
            onSubmitUndelegate={onSubmitUndelegate}
            closeModal={() => setShow(false)}
          />
        )}
      </ModalRoot>
    </>
  );
}

UndelegateModalWrapper.propTypes = {
  delegatee: PropTypes.string.isRequired,
  onSubmitUndelegate: PropTypes.func.isRequired,
};

export default UndelegateModalWrapper;
