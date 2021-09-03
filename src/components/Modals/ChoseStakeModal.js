import React from 'react';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';

const ChoseStakeModal = ({
  // eslint-disable-next-line react/prop-types,max-len
  closeModal, handleSubmit, register, modalShown, setModalShown, handleSubmitStakePolka, handleSubmitStakeLiberland,
}) => (
  <>
    { modalShown === 0 && (
      <form className={styles.ChoseStakeModal}>
        <div className={styles.buttonWrapper}>
          <Button
            primary
            medium
            onClick={() => setModalShown(1)}
          >
            Polka Stake
          </Button>
          <Button
            primary
            medium
            onClick={() => setModalShown(2)}
          >
            Liberland Stake
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
     <div className={styles.h3}>Polka stake</div>
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
   ) }

    { modalShown === 2
  && (
  <form
    className={styles.getCitizenshipModal}
    onSubmit={handleSubmit(handleSubmitStakeLiberland)}
  >
    <div className={styles.h3}>Liberland stake</div>
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
  </>
);

const ChoseStakeModalWrapper = (props) => (
  <ModalRoot>
    <ChoseStakeModal {...props} />
  </ModalRoot>
);

export default ChoseStakeModalWrapper;
