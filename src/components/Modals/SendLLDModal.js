// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { parseDollars, parseMerits, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import { walletSelectors } from '../../redux/selectors';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';

function SendLLDModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = balances?.liquidAmount?.amount !== '0x0' ? BN.max(
    BN_ZERO,
    new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')), // leave at least 2 liquid LLD...
  ) : 0;

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    trigger,
  } = useForm({
    mode: 'all',
  });

  const transfer = (values) => {
    dispatch(
      walletActions.sendTransfer.call({
        recipient: values.recipient,
        amount: parseDollars(values.amount),
      }),
    );
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond)) {
        return 'Minimum of 2 LLD must remain after transaction';
      }
      if (unbondValue.lte(BN_ZERO)) {
        return 'Invalid amount';
      }
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(transfer)}
    >
      <div className={styles.h3}>Send LLD</div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send to address</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Send to address"
        isRequired
        trigger={trigger}
        setValue={setValue}
        validate={(v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        }}
      />
      {errors?.recipient?.message && (
        <div className={styles.error}>{errors.recipient.message}</div>
      )}

      <div className={styles.title}>Amount LLD</div>
      <TextInput
        errorTitle="Amount LLD"
        register={register}
        validate={validateUnbondValue}
        name="amount"
        placeholder="Amount LLD"
        required
      />
      {errors?.amount?.message && (
        <div className={styles.error}>{errors.amount.message}</div>
      )}

      <div className={styles.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Make transfer
        </Button>
      </div>
    </form>
  );
}

SendLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLDModalWrapper() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button className={styles.button} onClick={() => setOpen(true)}>
        Send LLD
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot>
          <SendLLDModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default SendLLDModalWrapper;
