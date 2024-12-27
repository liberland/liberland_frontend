import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { blockchainSelectors } from '../../redux/selectors';

function DelegateModal({
  closeModal,
  delegateAddress,
  currentlyDelegatingTo,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const handleSubmitDelegate = () => {
    dispatch(democracyActions.delegate.call({ values: { delegateAddress }, userWalletAddress }));
    closeModal();
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmitDelegate}
    >
      <Title level={3}>Delegate your votes</Title>

      {currentlyDelegatingTo && (
        <Paragraph>
          You&apos;re currently delegating to
          {' '}
          {currentlyDelegatingTo}
        </Paragraph>
      )}

      <Paragraph>
        You will delegate your votes to address
        {' '}
        {delegateAddress}
        {' '}
        that belongs to a Congress Member.
      </Paragraph>

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
          Delegate
        </Button>
      </Flex>
    </Form>
  );
}

DelegateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  delegateAddress: PropTypes.string.isRequired,
  currentlyDelegatingTo: PropTypes.string.isRequired,
};

function DelegateModalWrapper({
  delegateAddress,
  currentlyDelegatingTo,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        primary
        onClick={() => setShow(true)}
      >
        Delegate
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(true)}>
          <DelegateModal
            closeModal={() => setShow(false)}
            delegateAddress={delegateAddress}
            currentlyDelegatingTo={currentlyDelegatingTo}
          />
        </ModalRoot>
      )}
    </>
  );
}

DelegateModalWrapper.propTypes = {
  delegateAddress: PropTypes.string.isRequired,
  currentlyDelegatingTo: PropTypes.string.isRequired,
};

export default DelegateModalWrapper;
