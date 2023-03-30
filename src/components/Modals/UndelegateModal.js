import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function UndelegateModal({
  handleSubmit, closeModal, delegatee, onSubmitUndelegate,
}) {
  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitUndelegate)}
    >
      <div className={styles.h3}>Undelegate your votes</div>

      You're currently delegating your votes to {delegatee}.

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
        >
          Undelegate
        </Button>
      </div>
    </form>
  );
}

UndelegateModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  delegatee: PropTypes.string.isRequired,
  onSubmitUndelegate: PropTypes.func.isRequired,
};

function UndelegateModalWrapper(props) {
  return (
    <ModalRoot>
      <UndelegateModal {...props} />
    </ModalRoot>
  );
}

export default UndelegateModalWrapper;
