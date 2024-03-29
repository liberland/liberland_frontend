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
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';

function CongressAmendLegislationViaReferendumModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const sectionContent = legislation.sections[section]?.content.toHuman() ?? '';
  const {
    handleSubmit, register, formState: { errors }, watch,
  } = useForm({
    defaultValues: {
      tier,
      year: id.year,
      index: id.index,
      section,
      content: sectionContent,
      ...FastTrackDefaults,
    },
  });

  const onSubmit = ({
    discussionName,
    discussionDescription,
    discussionLink,
    content, fastTrack, fastTrackVotingPeriod, fastTrackEnactmentPeriod,
  }) => {
    dispatch(congressActions.congressAmendLegislationViaReferendum.call({
      discussionName,
      discussionDescription,
      discussionLink,
      tier,
      id,
      section,
      content,
      fastTrack,
      fastTrackVotingPeriod,
      fastTrackEnactmentPeriod,
    }));
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.h3}>
        Propose a Motion for Referendum -
        {legislation.sections[section] ? 'amend legislation' : 'add legislation section'}
      </div>

      <div className={styles.title}>Legislation Tier</div>
      <SelectInput
        register={register}
        name="tier"
        disabled
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

      <ProposalDiscussionFields {...{ register, errors }} />
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

CongressAmendLegislationViaReferendumModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

export default function CongressAmendLegislationViaReferendumModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressAmendLegislationViaReferendumModal {...props} />
    </ModalRoot>
  );
}
