import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxInput, TextInput } from '../../InputComponents';
import styles from '../../Modals/styles.module.scss';

export const FastTrackDefaults = {
  fastTrack: false,
  fastTrackVotingPeriod: 3,
  fastTrackEnactmentPeriod: 1,
};

export default function FastTrackForm({
  register, errors, watch,
}) {
  const fastTrack = watch('fastTrack');
  const validateVotingPeriod = (v) => (
    (!Number.isNaN(parseInt(v))
    && parseInt(v) >= 3)
    || 'Invalid value, must be a number, minimum 3.'
  );
  const validateEnactmentPeriod = (v) => (
    (!Number.isNaN(parseInt(v))
    && parseInt(v) >= 0)
    || 'Invalid value, must be a non-negative number.'
  );
  return (
    <>
      <CheckboxInput
        register={register}
        name="fastTrack"
        label="Fast track proposal"
      />

      {fastTrack && (
      <>
        <div className={styles.title}>Referendum period</div>
        <div className={styles.description}>
          How long should voting take, specified in days, minimum 3 days.
        </div>
        <TextInput
          register={register}
          name="fastTrackVotingPeriod"
          required
          validate={validateVotingPeriod}
          errorTitle="Referendum period"
        />
        {errors?.fastTrackVotingPeriod?.message
        && <div className={styles.error}>{errors.fastTrackVotingPeriod.message}</div>}

        <div className={styles.title}>Enactment period</div>
        <div className={styles.description}>
          Delay between referendum end and its execution, specified in days.
        </div>
        <TextInput
          register={register}
          name="fastTrackEnactmentPeriod"
          required
          validate={validateEnactmentPeriod}
          errorTitle="Enactment period"
        />
        {errors?.fastTrackEnactmentPeriod?.message
        && <div className={styles.error}>{errors.fastTrackEnactmentPeriod.message}</div>}
      </>
      )}
    </>
  );
}

FastTrackForm.propTypes = {
  register: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object.isRequired,
};
