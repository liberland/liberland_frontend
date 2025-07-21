import React, { useContext } from 'react';
import Modal from 'antd/es/modal';
import Flex from 'antd/es/flex';
import Result from 'antd/es/result';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { blockchainSelectors } from '../../redux/selectors';
import Button from '../Button/Button';
import { blockchainActions } from '../../redux/actions';

function ErrorModal() {
  const errorExistsAndUnacknowledged = useSelector(blockchainSelectors.errorExistsAndUnacknowledgedByUser);
  const blockchainError = useSelector(blockchainSelectors.blockchainError);
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const close = () => dispatch(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call(false));

  return (
    <Modal
      open={errorExistsAndUnacknowledged}
      onClose={close}
      onCancel={close}
      footer={null}
      closable
      maskClosable
    >
      <Result
        status="500"
        title={blockchainError?.details || 'Error'}
        extra={blockchainError?.type !== 'LOGIN_ERROR'
          ? (
            <Button
              primary
              onClick={close}
            >
              Close modal
            </Button>
          ) : (
            <Flex wrap justify="center" align="center" gap="15px">
              <Button
                onClick={close}
              >
                Cancel
              </Button>
              <Button primary onClick={login}>Login</Button>
            </Flex>
          )}
      />
    </Modal>
  );
}

export default ErrorModal;
