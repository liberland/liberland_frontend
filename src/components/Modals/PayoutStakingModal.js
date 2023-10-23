import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';

function PayoutStakingModal({
  closeModal,
}) {
  const dispatch = useDispatch();

  const payout = () => {
    dispatch(validatorActions.payout.call());
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={payout}
    >
      <div className={styles.h3}>Payout staking rewards</div>
      <div className={styles.title}>
        Staking rewards are paid per staking era and validator. These payouts will
        be batched 10 at a time, but it&apos;s still possible that your wallet will ask
        you to sign multiple transactions.
      </div>

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
          Payout
        </Button>
      </div>
    </form>
  );
}

PayoutStakingModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function PayoutStakingModalWrapper(props) {
  return (
    <ModalRoot>
      <PayoutStakingModal {...props} />
    </ModalRoot>
  );
}

export default PayoutStakingModalWrapper;
