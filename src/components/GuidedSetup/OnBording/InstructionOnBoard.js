import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

const link = 'https://docs.liberland.org/public-documents/blockchain/for-citizens/claiming-residency';

function InstructionOnBoard({ setIsClicked }) {
  const onClick = () => {
    sessionStorage.setItem('notResidentAcceptedByUser', true);
    setIsClicked(true);
  };
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
          onClick={onClick}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

InstructionOnBoard.propTypes = {
  setIsClicked: PropTypes.func.isRequired,
};

export default InstructionOnBoard;
