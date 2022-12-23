import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainSelectors } from '../../redux/selectors';
import Button from '../Button/Button';
import { blockchainActions } from '../../redux/actions';

function ErrorModal({ children }) {
  const errorExistsAndUnacknowledged = useSelector(blockchainSelectors.errorExistsAndUnacknowledgedByUser);
  const blockchainError = useSelector(blockchainSelectors.blockchainError);
  const dispatch = useDispatch();

  return (
    <div style={{ position: 'relative' }}>
      { errorExistsAndUnacknowledged
    && (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999999,
          background: 'rgba(211,211,211,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '250px',
            height: '250px',
            backgroundColor: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRadius: 10,
            padding: '25px',
            paddingBottom: '10px',
          }}
        >
          <p style={{
            fontWeight: '1.5rem',
            marginBottom: '2.5rem',
          }}
          >
            {blockchainError?.details}
          </p>
          <br />
          <Button
            primary
            onClick={() => {
              console.log('clicked button');
              dispatch(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call(false));
            }}
          >
            Ok
          </Button>
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
