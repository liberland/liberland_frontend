import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, SelectInput } from '../../../../InputComponents';
import Button from '../../../../Button/Button';
import styles from './styles.module.scss';
import router from '../../../../../router';
import { congressSelectors } from '../../../../../redux/selectors';
import { AddLegislationFields } from '../AddLegislationFields/AddLegislationFields';
import { congressActions } from '../../../../../redux/actions';

function CongressAddLegislation() {
  const dispatch = useDispatch();
  const isLoading = useSelector(congressSelectors.isLoading);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    handleSubmit, formState: { errors }, register, control, watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      tier: 'InternationalTreaty',
      year: new Date().getFullYear(),
      sections: [
        { value: 'Paste markdown to autosplit sections' },
      ],
    },
  });

  if (!isLoading && shouldRedirect) return <Redirect to={router.congress.motions} />;

  const propose = ({
    tier, year, index, sections: sectionsRaw,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(congressActions.congressProposeLegislation.call({
      tier,
      id: { year, index },
      sections,
    }));
    setShouldRedirect(true);
  };

  return (
    <form
      onSubmit={handleSubmit(propose)}
    >
      <div className={styles.h3}>Propose a new Referendum</div>

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

      <AddLegislationFields {...{
        register, control, errors, watch,
      }}
      />

      <div className={styles.buttonWrapper}>
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

export default CongressAddLegislation;
