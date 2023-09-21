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

function CongressRepealLegislationModal({
  closeModal, tier, id,
}) {
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      tier,
      year: id.year,
      index: id.index,
    }
  });

  const onSubmitRepeal = () => {
    dispatch(congressActions.congressRepealLegislation.call({ tier, id }));
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmitRepeal)}
    >
      <div className={styles.h3}>Propose a Congress Motion - repeal legislation</div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="tier"
        disabled
        options={[
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
        disabled
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

CongressRepealLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
};

function CongressRepealLegislationModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressRepealLegislationModal {...props} />
    </ModalRoot>
  );
}

export default CongressRepealLegislationModalWrapper;
