import React from 'react';
import { useSelector } from 'react-redux';
import { BN } from '@polkadot/util';


// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletSelectors } from '../../redux/selectors';
import { valueToBN, formatMerits, dollarsToGrains } from '../../utils/walletHelpers';

function ChoseStakeModal({
  // eslint-disable-next-line react/prop-types,max-len
  closeModal, handleSubmit, register, modalShown, setModalShown, handleSubmitStakePolka, handleSubmitStakeLiberland, handleSubmitUnpool,
  errors,
}) {
  const balances = useSelector(walletSelectors.selectorBalances);
  const unpool_amount = valueToBN(balances.liberstake.amount).mul(new BN(8742)).div(new BN(1000000));
  const unpool_liquid = valueToBN(balances.liquidMerits.amount).add(unpool_amount);
  const unpool_stake = valueToBN(balances.liberstake.amount).sub(unpool_amount);

  return (
    <>
      { modalShown === 0 && (
      <form className={styles.ChoseStakeModal}>
        <div className={styles.buttonWrapper}>
          <Button
            primary
            medium
            onClick={() => setModalShown(2)}
          >
            PolitiPool
          </Button>
          <Button
            primary
            medium
            onClick={() => setModalShown(3)}
          >
            Unpool
          </Button>
          <Button
            primary
            medium
            onClick={() => setModalShown(1)}
          >
            Validator Stake
          </Button>

          <Button
            medium
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </form>
      )}
      { modalShown === 1
   && (
   <form
     className={styles.getCitizenshipModal}
     onSubmit={handleSubmit(handleSubmitStakePolka)}
   >
     <div className={styles.h3}>Validator Stake</div>
     <div className={styles.title}>Amount LLD</div>
     
     <TextInput
       register={register}
       name="amount"
       placeholder="Amount LLD"
       validate={v =>
        valueToBN(balances.liquidAmount.amount).sub(
            dollarsToGrains(v)
          ).gte(dollarsToGrains(1)) || 'You must leave at least 1 LLD unstaked'
       }
     />
     { errors?.amount?.type == "validate" ?
     <p className={styles.error}>{errors.amount.message}</p> : null}

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
   ) }

      { modalShown === 2
  && (
  <form
    className={styles.getCitizenshipModal}
    onSubmit={handleSubmit(handleSubmitStakeLiberland)}
  >
    <div className={styles.h3}>PolitiPool</div>
    <div className={styles.title}>Amount LLM</div>
    <TextInput
      register={register}
      name="amount"
      placeholder="Amount LLM"
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
        Stake
      </Button>
    </div>
  </form>
  )}

      { modalShown === 3
  && (
  <form
    className={styles.getCitizenshipModal}
    onSubmit={handleSubmit(handleSubmitUnpool)}
  >
    <div className={styles.h3}>Unpool</div>
    <div className={styles.title}>
      Are you sure you want to go on welfare and temporarily forfeit your citizenship rights such as voting for a month?
      This will instantly turn {formatMerits(unpool_amount)} LLM from pooled into liquid for a
      total of {formatMerits(unpool_stake)} pooled LLM and {formatMerits(unpool_liquid)} liquid.
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
        Unpool
      </Button>
    </div>
  </form>
  )}
    </>
  );
}

function ChoseStakeModalWrapper(props) {
  return (
    <ModalRoot>
      <ChoseStakeModal {...props} />
    </ModalRoot>
  );
}

export default ChoseStakeModalWrapper;
