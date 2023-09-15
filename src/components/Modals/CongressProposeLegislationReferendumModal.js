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
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';

function CongressProposeLegislationReferendumModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: FastTrackDefaults,
  });

  const onSubmitPropose = (values) => {
    dispatch(congressActions.congressProposeLegislationReferendum.call(values));
    closeModal();
  };

  const validateIndex = (v) => (
    (!Number.isNaN(parseInt(v))
    && parseInt(v) >= 0)
    || 'Invalid value, must be a non-negative number.'
  );

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
          // no constitution, as it requires propose_rich
          { value: '2', display: 'International Treaty' },
          { value: '2', display: 'Law' },
          { value: '3', display: 'Tier3' }, // FIXME proper names
          { value: '4', display: 'Tier4' },
          { value: '5', display: 'Tier5' },
          { value: '6', display: 'Decision' },
        ]}
      />

      <div className={styles.title}>Legislation Index</div>
      <TextInput
        required
        errorTitle="Index"
        register={register}
        name="index"
        placeholder="Legislation index"
        validate={validateIndex}
      />
      { errors?.index?.message ? <div className={styles.error}>{errors.index.message}</div> : null }

      <div className={styles.title}>Legislation Content</div>
      <TextInput
        required
        errorTitle="Content"
        register={register}
        name="content"
        placeholder="Legislation content"
      />
      { errors?.content?.message ? <div className={styles.error}>{errors.content.message}</div> : null }

      <FastTrackForm {...{ register, errors, watch }} />

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

CongressProposeLegislationReferendumModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function CongressProposeLegislationReferendumModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressProposeLegislationReferendumModal {...props} />
    </ModalRoot>
  );
}

export default CongressProposeLegislationReferendumModalWrapper;
