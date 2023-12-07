import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { TextInput } from '../../../../InputComponents';

export function ProposalDiscussionFields({
  register,
  errors,
}) {
  return (
    <>
      <div className={styles.title}>Discussion Name</div>
      <TextInput
        required
        errorTitle="Name"
        register={register}
        name="discussionName"
        placeholder="Discussion name"
      />
      {errors?.discussionName?.message ? <div className={styles.error}>{errors.discussionName.message}</div> : null}

      <div className={styles.title}>Discussion Description</div>
      <TextInput
        required
        errorTitle="Discussion description"
        register={register}
        name="discussionDescription"
        placeholder="Discussion description"
      />
      {errors?.discussionDescription?.message
        ? <div className={styles.error}>{errors.discussionDescription.message}</div>
        : null}

      <div className={styles.title}>Discussion Link</div>
      <TextInput
        required
        errorTitle="Discussion link"
        register={register}
        name="discussionLink"
        placeholder="Discussion Link"
      />
      {errors?.discussionLink?.message ? <div className={styles.error}>{errors.discussionLink.message}</div> : null}
    </>
  );
}

ProposalDiscussionFields.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    discussionName: PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
    discussionDescription: PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
    discussionLink: PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
