import React from 'react';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

const renderVoteButton = (vote) => {
  return vote === 'Yay' ? <Button green medium type="submit">Vote Yay</Button> : <Button red medium type="submit">Vote Nay</Button>;
}

const VoteOnReferendumModal = ({
  // eslint-disable-next-line react/prop-types,max-len
  closeModal, handleSubmit, register, modalShown, setModalShown, onSubmit, voteType, referendumInfo
}) => (
  <>
    { modalShown === 1 && (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.h3}>{referendumInfo.name}</div>
      <div className={styles.title}>Amount LLM</div>
      <TextInput
        register={register}
        name="amount"
        placeholder="Amount LLM"
      />

      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        {renderVoteButton(voteType)}
      </div>
    </form>
    )}
    { modalShown === 2 && (
      <form
        className={styles.getCitizenshipModal}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.h3}>{referendumInfo.name}</div>
        <div className={styles.title}>Amount LLD</div>
        <TextInput
          register={register}
          name="amount"
          placeholder="Amount LLD"
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
            Endorse
          </Button>
        </div>
      </form>
    )}
  </>

);

const VoteOnReferendumModalWrapper = (props) => (
  <ModalRoot>
    <VoteOnReferendumModal {...props} />
  </ModalRoot>
);

export default VoteOnReferendumModalWrapper;
