import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import { SelectInput } from '../InputComponents';
import Button from '../Button/Button';

import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';
import { validatorSelectors } from '../../redux/selectors';

function StakingRewardsDestinationModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const payee = useSelector(validatorSelectors.payee);

  const {
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      payee: payee.toString(),
    },
  });

  const onSubmit = (values) => {
    dispatch(validatorActions.setPayee.call(values));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Change staking rewards destination</div>

      <div className={styles.title}>New destination</div>
      <SelectInput
        register={register}
        name="payee"
        options={[
          { value: 'Staked', display: 'Increase stake' },
          { value: 'Stash', display: 'Deposit in the account (without staking)' },
          { value: 'Controller', display: 'Controller (deprecated)' },
        ]}
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
          Change destination
        </Button>
      </div>
    </form>
  );
}

StakingRewardsDestinationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function StakingRewardsDestinationModalWrapper(props) {
  return (
    <ModalRoot>
      <StakingRewardsDestinationModal {...props} />
    </ModalRoot>
  );
}
