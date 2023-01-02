import React from 'react';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
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
      <TextInput
        register={register}
        name="legislationTier"
        placeholder="1"
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

function VoteOnReferendumModalWrapper(props) {
  return (
    <ModalRoot>
      <ProposeReferendumModal {...props} />
    </ModalRoot>
  );
}

export default VoteOnReferendumModalWrapper;
