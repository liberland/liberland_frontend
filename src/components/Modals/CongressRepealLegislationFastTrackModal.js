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

function CongressRepealLegislationFastTrackModal({
  closeModal, tier, index,
}) {
  const dispatch = useDispatch();
  const {
    handleSubmit, formState: { errors }, register, watch,
  } = useForm({
    defaultValues: { tier, index, ...FastTrackDefaults },
  });

  const onSubmitRepeal = (values) => {
    dispatch(congressActions.congressProposeRepealLegislation.call(values));
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitRepeal)}
    >
      <div className={styles.h3}>Propose a Congress Motion - propose referendum for legislation repeal</div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="tier"
        disabled
        options={[
          { value: '1', display: 'International Treaties' },
          { value: '2', display: 'Tier 2' },
          { value: '3', display: 'Tier 3' },
          { value: '4', display: 'Tier 4' },
          { value: '5', display: 'Tier 5' },
          { value: '6', display: 'Decisions' },
        ]}
      />

      <div className={styles.title}>Legislation Index</div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="Index"
        register={register}
        name="index"
        disabled
      />

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

CongressRepealLegislationFastTrackModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
};

function CongressRepealLegislationFastTrackModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressRepealLegislationFastTrackModal {...props} />
    </ModalRoot>
  );
}

export default CongressRepealLegislationFastTrackModalWrapper;
