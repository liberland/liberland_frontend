import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { useForm } from 'react-hook-form';
import { BN_ZERO } from '@polkadot/util';
import cx from 'classnames';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';
import { walletSelectors } from '../../redux/selectors';

function PolitipoolModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'all',
  });

  const handleSubmitStakeLiberland = ({ amount }) => {
    dispatch(walletActions.stakeToLiberland.call({
      amount: parseMerits(amount),
    }));
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(handleSubmitStakeLiberland)}
    >
      <div className={styles.h3}>PolitiPool</div>
      <div className={styles.title}>Amount LLM</div>
      <div className={cx(styles.description, styles.modalDescription)}>
        Thank you for contributing with your voluntary tax. You will be able to use your LLMs as voting power and
        also dividend rewards in case of a government budget surplus. However, keep in mind that should you wish
        to go on welfare, you will only be able to unpool 10% of your LLMs a year.
      </div>
      <TextInput
        register={register}
        validate={validateUnbondValue}
        required
        name="amount"
        placeholder="Amount LLM"
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

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
          Stake
        </Button>
      </div>
    </form>
  );
}

PolitipoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function PolitipoolModalWrapper() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button className={styles.button} primary onClick={() => setOpen(true)}>
        Politipool
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot>
          <PolitipoolModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default PolitipoolModalWrapper;
