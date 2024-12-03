import React, { useContext } from 'react';
import PropTypes from 'prop-types';

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
  return (
    <div className={styles.content} style={{ position: 'relative' }}>
      { errorExistsAndUnacknowledged
    && (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <p className={styles.text}>
            {blockchainError?.details}
          </p>
          {
            blockchainError?.type !== 'LOGIN_ERROR'
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
                    Canel
                  </Button>
                  <Button primary onClick={login}>Login</Button>
                </div>
              )
          }

        </div>
      </div>
    )}
      { children }
    </div>
  );
}

ErrorModal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorModal;
