import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput, SelectInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { congressActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';

function CongressAmendLegislationModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const sectionContent = legislation.sections[section]?.content.toHuman() ?? '';
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      tier,
      year: id.year,
      index: id.index,
      section,
      content: sectionContent,
    },
  });

  const onSubmit = ({ content }) => {
    dispatch(congressActions.congressAmendLegislation.call({
      tier, id, section, content,
    }));
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.h3}>
        Propose a Motion -
        {legislation.sections[section] ? 'amend legislation' : 'add legislation section'}
      </div>

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

      <div className={styles.title}>Legislation Section</div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="Section"
        register={register}
        name="section"
        disabled
      />

      <div className={styles.title}>Legislation Content</div>
      <TextInput
        required
        errorTitle="Content"
        register={register}
        name="content"
      />
      {errors?.content?.message
        && <div className={styles.error}>{errors.content.message}</div>}

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

CongressAmendLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function CongressAmendLegislationModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressAmendLegislationModal {...props} />
    </ModalRoot>
  );
}

export default CongressAmendLegislationModalWrapper;
