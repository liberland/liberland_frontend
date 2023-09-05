import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';
import { CreateValidatorModal, StartValidatorModal, StakeLLDModal } from '../../../Modals';
import styles from '../styles.module.scss';

function SwitchToValidator() {
  const [isValidatorModalOpen, setIsValidatorModalOpen] = useState(false);
  const handleValidatorModalOpen = () => setIsValidatorModalOpen(!isValidatorModalOpen);
  return (
    <div>
      <div className={styles.rowWrapper}>
        <span>Current staking mode: </span>
        <span><b>Nominator</b></span>
      </div>
      <div>
        <div className={styles.rowEnd}>
          <Button small primary onClick={handleValidatorModalOpen}>
            Switch to Validator
          </Button>
        </div>
        {isValidatorModalOpen && <StartValidatorModal closeModal={handleValidatorModalOpen} />}
      </div>
    </div>
  );
}

function SwitchToNominator() {
  const dispatch = useDispatch();
  const chill = () => {
    dispatch(validatorActions.chill.call());
  };
  return (
    <div>
      <div className={styles.rowWrapper}>
        <span>Current staking mode: </span>
        <span><b>Validator</b></span>
      </div>
      <div className={styles.rowEnd}>
        <Button small primary onClick={chill}>
          Switch to Nominator
        </Button>
      </div>
    </div>
  );
}

function Switcher() {
  const info = useSelector(validatorSelectors.info);
  return info.isStakingValidator ? <SwitchToNominator /> : <SwitchToValidator />;
}

function Starter() {
  const [isValidatorModalOpen, setIsValidatorModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const handleValidatorModalOpen = () => setIsValidatorModalOpen(!isValidatorModalOpen);
  const handleStakeModalOpen = () => setIsStakeModalOpen(!isStakeModalOpen);

  return (
    <div className={styles.rowEnd}>
      <Button small primary onClick={handleStakeModalOpen}>
        Start Nominating
      </Button>
      <Button small primary onClick={handleValidatorModalOpen}>
        Start Validating
      </Button>
      {isValidatorModalOpen && <CreateValidatorModal closeModal={handleValidatorModalOpen} />}
      {isStakeModalOpen && <StakeLLDModal closeModal={handleStakeModalOpen} />}
    </div>
  );
}

export default function StakingMode() {
  const info = useSelector(validatorSelectors.info);

  return info?.stash ? <Switcher /> : <Starter />;
}
