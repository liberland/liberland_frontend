import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import { nftsActions } from '../../../redux/actions';
import OpenModalButton from '../components/OpenModalButton';
import modalWrapper from '../components/ModalWrapper';

function CreateEditCollectionForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const [form] = Form.useForm();

  const createCollection = () => {
    dispatch(nftsActions.createCollection.call({ walletAdmin: walletAddress, config: {} }));
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={createCollection}>
      <Title level={3}>
        Create Collection
      </Title>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button primary type="submit">
          Create
        </Button>
      </Flex>
    </Form>
  );
}

CreateEditCollectionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Create collection" {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

const CreateEditCollectionModal = modalWrapper(CreateEditCollectionForm, ButtonModal);

export default CreateEditCollectionModal;
