import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';

function CreatEditCollectionModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const [form] = Form.useForm();

  const createCollection = () => {
    dispatch(nftsActions.createCollection.call({ walletAdmin: walletAddress, config: {} }));
    closeModal();
  };

  return (
    <Form form={form} layout="vertical" onFinish={createCollection}>
      <Title level={3}>
        Create Collection
      </Title>
      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
          Cancel
        </Button>
        <Button primary type="submit">
          Create
        </Button>
      </Flex>
    </Form>
  );
}

CreatEditCollectionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function CreateEditCollectionModalWrapper() {
  const [show, setShow] = useState();
  return (
    <>
      <Button primary onClick={() => setShow(true)}>
        Create collection
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CreatEditCollectionModal closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default CreateEditCollectionModalWrapper;
