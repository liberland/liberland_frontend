import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import styles from '../styles.module.scss';

export default function RewardsConfig() {
  const dispatch = useDispatch();
  const payee = useSelector(validatorSelectors.payee);

  useEffect(() => {
    dispatch(validatorActions.getPayee.call());
  }, [dispatch]);

  return (
    <div className={styles.rowWrapper}>
      <span>Staking rewards destination: </span>
      <span>
        {' '}
        <b>{payee?.toString()}</b>
      </span>
    </div>
  );
}
