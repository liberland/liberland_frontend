import React from 'react';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

const link = 'https://liberland-1.gitbook.io/wiki/v/public-documents/blockchain/for-citizens/claiming-residency';

function InstructionOnBoard() {
  return (
    <div className={styles.wrapper}>
      <h3>You are not yet an e-resident.</h3>
      <h4>
        If you want to be a e-resident or citizen follow next steps:
        <br />
        <br />
        <a href={link} target="_blank" rel="noreferrer">
          {link}
        </a>
      </h4>
      <div className={styles.buttons}>
        <Button
          medium
          secondary
          onClick={() => sessionStorage.setItem('notResidentAcceptedByUser', true)}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

export default InstructionOnBoard;
