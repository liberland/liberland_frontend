import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

const renderVoteButton = (vote) => (vote === 'Aye'
  ? <Button green medium type="submit">Vote Aye</Button>
  : <Button red medium type="submit">Vote Nay</Button>);

function VoteOnReferendumModal({
  closeModal, handleSubmit, register, onSubmitVote,
  voteType, referendumInfo,
}) {
  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitVote)}
    >
      <div className={styles.h3}>{referendumInfo.name}</div>
      <div className={styles.title}>Referendum Index</div>
      <TextInput
        register={register}
        name="referendumIndex"
        placeholder="referendumIndex"
        value={referendumInfo.referendumIndex}
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
  );
}

VoteOnReferendumModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  onSubmitVote: PropTypes.func.isRequired,
  voteType: PropTypes.string.isRequired,
  referendumInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    referendumIndex: PropTypes.number.isRequired,
    proposalIndex: PropTypes.number.isRequired,
  }).isRequired,
};

function VoteOnReferendumModalWrapper(props) {
  return (
    <ModalRoot>
      <VoteOnReferendumModal {...props} />
    </ModalRoot>
  );
}

export default VoteOnReferendumModalWrapper;
