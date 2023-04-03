// LIBS
import React from 'react';
import { useForm } from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput, DateInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';

import { parseIdentityData, parseDOB, parseCitizenshipJudgement } from '../../utils/identityParser';

function OnchainIdentityModal({
  onSubmit, closeModal, identity, blockNumber, name,
}) {
  let defaultValues = {};
  let isKnownGood = false;
  if (identity.isSome) {
    const {judgements, info} = identity.unwrap();
    defaultValues = {
      display: parseIdentityData(info.display) ?? name,
      legal: parseIdentityData(info.legal) ?? name,
      web: parseIdentityData(info.web),
      email: parseIdentityData(info.email),
      date_of_birth: parseDOB(info.additional, blockNumber),
    }
    isKnownGood = parseCitizenshipJudgement(judgements);
  }

  const {
    handleSubmit,
    register,
  } = useForm({ defaultValues });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Update on-chain identity</div>
      <div className={styles.description}>
        You are going to update your identity stored on blockchain. This needs to be up-to-date for your citizenship.
      </div>
      { !isKnownGood ? null :
        <div className={styles.description}>
          Warning! Your identity is currently confirmed by citizenship office as valid. Changing it will require reapproval - you'll temporarily lose citizenship rights onchain.
        </div>
      }

      <div className={styles.title}>Display name</div>
      <TextInput
        register={register}
        name="display"
        placeholder="Display name"
      />

      <div className={styles.title}>Legal name</div>
      <TextInput
        register={register}
        name="legal"
        placeholder="Legal name"
      />
      <div className={styles.title}>Web address</div>
      <TextInput
        register={register}
        name="web"
        placeholder="Web address"
      />
      <div className={styles.title}>Email</div>
      <TextInput
        register={register}
        name="email"
        placeholder="Email"
      />

      {/* FIXME CheckboxInput is broken, it always sends citizen=false
      <div className={styles.title}>Are you or do you want to become a citizen?</div>
      <CheckboxInput
        register={register}
        name="citizen"
      />
      
      For now we set citizen=1 if date of birth is present
      */}
      <div className={styles.title}>Date of birth</div>
      <DateInput
        register={register}
        name="date_of_birth"
        placeholder="Date of birth"
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
          Set identity
        </Button>
      </div>
    </form>
  );
}

function OnchainIdentityModalWrapper(props) {
  return (
    <ModalRoot>
      <OnchainIdentityModal {...props} />
    </ModalRoot>
  );
}

export default OnchainIdentityModalWrapper;
