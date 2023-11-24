import React from 'react';

import PropTypes from 'prop-types';
import Button from '../Button/Button';
import ModalRoot from './ModalRoot';

import styles from './styles.module.scss';

function LogoutModal({ closeModal, handleLogout }) {
  return (
    <div
      className={styles.getCitizenshipModal}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '300px',
        margin: 'auto',
      }}
    >
      <Button small red onClick={handleLogout}>
        Logout
      </Button>
      <Button small primary onClick={closeModal}>
        Cancel
      </Button>
    </div>
  );
}

LogoutModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

function LogoutModalWrapper(props) {
  return (
    <ModalRoot>
      <LogoutModal {...props} />
    </ModalRoot>
  );
}

export default LogoutModalWrapper;
