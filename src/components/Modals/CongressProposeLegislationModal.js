import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput, SelectInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { congressActions } from '../../redux/actions';

function CongressProposeLegislationModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, register } = useForm({
    mode: 'all',
    defaultValues: {
      tier: 'InternationalTreaty',
      year: new Date().getFullYear(),
    },
  });

  const onSubmitPropose = ({
    tier, year, index, legislationContent,
  }) => {
    dispatch(congressActions.congressProposeLegislation.call({
      tier,
      id: { year, index },
      legislationContent,
    }));
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitPropose)}
    >
      <div className={styles.h3}>Propose a new Congress Motion</div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="tier"
        options={[
          { value: 'Constitution', display: 'Constitution' },
          { value: 'InternationalTreaty', display: 'International Treaty' },
        ]}
      />

      <div className={styles.title}>Legislation Year</div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="Year"
        register={register}
        name="year"
      />
      { errors?.year?.message && <div className={styles.error}>{errors.year.message}</div> }

      <div className={styles.title}>Legislation Index</div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="Index"
        register={register}
        name="index"
      />
      { errors?.index?.message && <div className={styles.error}>{errors.index.message}</div> }

      <div className={styles.title}>Legislation Content</div>
      <TextInput
        required
        errorTitle="Content"
        register={register}
        name="legislationContent"
      />
      { errors?.legislationContent?.message && <div className={styles.error}>{errors.legislationContent.message}</div> }

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
          Submit
        </Button>
      </div>
    </form>
  );
}

CongressProposeLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function CongressProposeLegislationModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressProposeLegislationModal {...props} />
    </ModalRoot>
  );
}

export default CongressProposeLegislationModalWrapper;
