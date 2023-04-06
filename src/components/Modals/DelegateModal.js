import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function DelegateModal({
  closeModal, onSubmitDelegate, delegateAddress, currentlyDelegatingTo,
}) {
  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={() => {}}
    >
      <div className={styles.h3}>Delegate your votes</div>


      { !currentlyDelegatingTo ? null :
        <div className={styles.title}>You're currently delegating to {currentlyDelegatingTo}</div> }

      <div className={styles.title}>You will delegate your votes to address {delegateAddress} that belongs to a Congress Member.</div>

      <div className={styles.buttonWrapper}>
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
          onClick={() => {onSubmitDelegate(delegateAddress)}}
        >
          Delegate
        </Button>
      </div>
    </form>
  );
}

DelegateModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  onSubmitDelegate: PropTypes.func.isRequired,
};

function DelegateModalWrapper(props) {
  return (
    <ModalRoot>
      <DelegateModal {...props} />
    </ModalRoot>
  );
}

export default DelegateModalWrapper;
