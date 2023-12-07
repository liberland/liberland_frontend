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

// STYLES
import styles from './styles.module.scss';
import { isValidSubstrateAddress } from '../../utils/bridge';
import { parseDollars, parseMerits } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import { walletSelectors } from '../../redux/selectors';

function SendLLDModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const senderWallet = useSelector(walletSelectors.selectorWalletAddress);
  const maxUnbond = BN.max(
    BN_ZERO,
    (new BN(balances?.liquidAmount?.amount ?? 0))
      .sub(parseDollars('10')), // leave at least 10 liquid LLD...
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all',
  });

  const transfer = (values) => {
    dispatch(walletActions.sendTransfer.call({
      recipient: values.recipient,
      amount: parseDollars(values.amount),
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
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>Send LLD</div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send to address</div>
      <TextInput
        register={register}
        name="recipient"
        placeholder="Send to address"
        required
        validate={((v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          if (v.toLowerCase() === senderWallet.toLowerCase()) return 'Invalid Address';
          return true;
        })}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>Amount LLD</div>
      <TextInput
        register={register}
        validate={validateUnbondValue}
        name="amount"
        placeholder="Amount LLD"
        required
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
          Make transfer
        </Button>
      </div>
    </form>
  );
}

SendLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLDModalWrapper(props) {
  return (
    <ModalRoot>
      <SendLLDModal {...props} />
    </ModalRoot>
  );
}

export default SendLLDModalWrapper;
