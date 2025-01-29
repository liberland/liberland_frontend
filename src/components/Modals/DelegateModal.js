import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { blockchainSelectors } from '../../redux/selectors';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';

function DelegateForm({
  onClose,
  delegateAddress,
  currentlyDelegatingTo,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const handleSubmitDelegate = () => {
    dispatch(democracyActions.delegate.call({ values: { delegateAddress }, userWalletAddress }));
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
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
          onClick={onClose}
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

DelegateForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  delegateAddress: PropTypes.string.isRequired,
  currentlyDelegatingTo: PropTypes.string.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Delegate" {...props} />
  );
}
const DelegateModal = modalWrapper(DelegateForm, ButtonModal);

export default DelegateModal;
