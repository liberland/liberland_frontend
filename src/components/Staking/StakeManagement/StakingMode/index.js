import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { validatorSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';
import { CreateValidatorModal, StartValidatorModal, StakeLLDModal } from '../../../Modals';
import styles from '../styles.module.scss';

function SwitchToValidator() {
  return (
    <div>
      <div className={cx(styles.rowWrapper, styles.currentlyStaked)}>
        <span>Current staking mode: </span>
        <span>Nominator</span>
      </div>
      <div>
        <div className={styles.rowEnd}>
          <StartValidatorModal />
        </div>
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
      <div className={cx(styles.rowWrapper, styles.currentlyStaked)}>
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
  return (
    <div className={styles.rowEnd}>
      <StakeLLDModal label="Start nominating" />
      <CreateValidatorModal />
    </div>
  );
}

export default function StakingMode() {
  const info = useSelector(validatorSelectors.info);

  return info?.stash ? <Switcher /> : <Starter />;
}
