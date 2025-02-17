import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { blockchainSelectors } from '../../redux/selectors';
import Button from '../Button/Button';
import { blockchainActions } from '../../redux/actions';
import styles from './styles.module.scss';

function ErrorModal({ children }) {
  const errorExistsAndUnacknowledged = useSelector(blockchainSelectors.errorExistsAndUnacknowledgedByUser);
  const blockchainError = useSelector(blockchainSelectors.blockchainError);
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const close = () => dispatch(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call(false));
  return (
    <Modal
      open
      onClose={close}
      onCancel={close}
      footer={null}
      closable
      maskClosable
    >
      <Flex vertical gap="15px">
        {children}
        {errorExistsAndUnacknowledged && (
          <Flex wrap gap="15px">
            {blockchainError?.type !== 'LOGIN_ERROR'
              ? (
                <Button
                  primary
                  onClick={() => dispatch(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call(false))}
                >
                  Ok
                </Button>
              )
              : (
                <div className={styles.buttons}>
                  <Button
                    secondary
                    onClick={() => dispatch(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call(false))}
                  >
                    Cancel
                  </Button>
                  <Button primary onClick={login}>Login</Button>
                </div>
              )}
          </Flex>
        )}
      </Flex>
    </Modal>
  );
}

ErrorModal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorModal;
