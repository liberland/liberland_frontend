import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, SelectInput } from '../../../../InputComponents';
import Button from '../../../../Button/Button';
import styles from './styles.module.scss';
import { democracyActions } from '../../../../../redux/actions';
import router from '../../../../../router';
import { democracySelectors } from '../../../../../redux/selectors';
import { AddLegislationFields } from '../AddLegislationFields/AddLegislationFields';

export function AddLegislation() {
  const dispatch = useDispatch();
  const isLoading = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    handleSubmit, formState: { errors }, register, control, watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      tier: 'Law',
      sections: [
        { value: 'Paste markdown to autosplit sections' },
      ],
    },
  });

  if (!isLoading && shouldRedirect) return <Redirect to={router.voting.referendum} />;

  const propose = ({
    name, forumLink, tier, sections: sectionsRaw,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(democracyActions.propose.call({
      name, forumLink, tier, sections,
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
        options={[
          { value: 'Constitution', display: 'Constitution' },
          { value: 'InternationalTreaty', display: 'International Treaty' },
          { value: 'Law', display: 'Law' },
          { value: 'Tier3', display: 'Tier3' }, // FIXME proper names
          { value: 'Tier4', display: 'Tier4' },
          { value: 'Tier5', display: 'Tier5' },
          { value: 'Decision', display: 'Decision' },
        ]}
      />

      <div className={styles.title}>Legislation Name</div>
      <TextInput
        required
        errorTitle="Name"
        register={register}
        name="name"
        placeholder="legislationName"
      />
      {errors?.legislationName?.message ? <div className={styles.error}>{errors.legislationName.message}</div> : null}

      <div className={styles.title}>Forum Link</div>
      <TextInput
        required
        errorTitle="Forum link"
        register={register}
        name="forumLink"
        placeholder="forumLink"
      />
      {errors?.forumLink?.message ? <div className={styles.error}>{errors.forumLink.message}</div> : null}

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
