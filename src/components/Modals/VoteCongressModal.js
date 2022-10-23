// TODO delete
import React from 'react';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

const renderVoteButton = (vote) => {
  return vote === 'Aye' ? <Button green medium type="submit">Vote Aye</Button> : <Button red medium type="submit">Vote Nay</Button>;
}

const VoteCongressModal = ({
  // eslint-disable-next-line react/prop-types,max-len
  closeModal, handleSubmit, register, onSubmitVote, eligibleCandidates
}) => (
  <>
    <p>hello</p>
    <div className={styles.eligibleCandidatesList}>
      {eligibleCandidates.map(eligibleCandidate => {
        return <p>{eligibleCandidate.name}</p>
      })}
    </div>
    <p>Selected candidates</p>
  </>

);

const VoteCongressModalWrapper = (props) => (
  <ModalRoot>
    <VoteCongressModal {...props} />
  </ModalRoot>
);

export default VoteCongressModalWrapper;
