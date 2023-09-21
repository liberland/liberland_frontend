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
import FastTrackForm, { FastTrackDefaults } from '../../../../Congress/FastTrackForm';

export function CongressAddLegislationViaReferendum() {
  const dispatch = useDispatch();
  const isLoading = useSelector(congressSelectors.isLoading);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    handleSubmit, formState: { errors }, register, control, watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      year: new Date().getFullYear(),
      FastTrackDefaults,
      sections: [
        { value: 'Paste markdown to autosplit sections' },
      ],
    },
  });

  if (!isLoading && shouldRedirect) return <Redirect to={router.congress.motions} />;

  const propose = ({
    tier,
    year,
    index,
    sections: sectionsRaw,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(congressActions.congressProposeLegislationViaReferendum.call({
      tier,
      id: { year, index },
      sections,
      fastTrack,
      fastTrackVotingPeriod,
      fastTrackEnactmentPeriod,
    }));
    setShouldRedirect(true);
  };

  return (
    <form
      onSubmit={handleSubmit(propose)}
    >
      <div className={styles.h3}>Propose a new Congress Motion</div>
      <div className={styles.description}>Propose a new Congress Motion to propose a Referendum</div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="tier"
        options={[
          // no constitution, as it requires propose_rich
          { value: 'InternationalTreaty', display: 'International Treaty' },
          { value: 'Law', display: 'Law' },
          { value: 'Tier3', display: 'Tier3' }, // FIXME proper names
          { value: 'Tier4', display: 'Tier4' },
          { value: 'Tier5', display: 'Tier5' },
          { value: 'Decision', display: 'Decision' },
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

      <FastTrackForm {...{ register, errors, watch }} />

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
