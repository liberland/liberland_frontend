import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput, SelectInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function ProposeReferendumModal({
  handleSubmit, closeModal, register, onSubmitPropose,
}) {
  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitPropose)}
    >
      <div className={styles.h3}>Propose a new Referendum</div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="legislationTier"
        options={[
          { value: "0", display: "Constitution"},
          { value: "2", display: "Law"},
          { value: "3", display: "Tier3"}, // FIXME proper names
          { value: "4", display: "Tier4"},
          { value: "5", display: "Tier5"},
          { value: "6", display: "Decision"},
        ]}
      />

      <div className={styles.title}>Legislation Name</div>
      <TextInput
        register={register}
        name="legislationName"
        placeholder="legislationName"
      />

      <div className={styles.title}>Forum Link</div>
      <TextInput
        register={register}
        name="forumLink"
        placeholder="forumLink"
      />

      <div className={styles.title}>Legislation Content</div>
      <TextInput
        register={register}
        name="legislationContent"
        placeholder="legislationContent"
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
          Submit
        </Button>
      </div>
    </form>
  );
}

ProposeReferendumModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  onSubmitPropose: PropTypes.func.isRequired,
};

function VoteOnReferendumModalWrapper(props) {
  return (
    <ModalRoot>
      <ProposeReferendumModal {...props} />
    </ModalRoot>
  );
}

export default VoteOnReferendumModalWrapper;
