import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function DelegateModal({
  handleSubmit, closeModal, register, onSubmitDelegate,
}) {
  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitDelegate)}
    >
      <div className={styles.h3}>Delegate your votes</div>


      <div className={styles.title}>Address of person you want to delegate to. You can only delegate to current Congress members.</div>
      <TextInput
        register={register}
        name="delegateAddress"
        placeholder="address"
      />

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
