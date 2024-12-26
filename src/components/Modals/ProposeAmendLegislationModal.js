import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { democracyActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import AgreeDisagreeModal from './AgreeDisagreeModal';
import useAgreeDisagreeModal from '../../hooks/useAgreeDisagreeModal';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function ProposeAmendLegislationModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const sectionContent = legislation.sections[section]?.content.toHuman() ?? '';
  const {
    handleSubmit,
    register,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      tier,
      year: id.year,
      index: id.index,
      section,
      content: sectionContent,
    },
  });

  const onSubmit = ({
    discussionName,
    discussionDescription,
    discussionLink,
    content,
  }) => {
    dispatch(
      democracyActions.proposeAmendLegislation.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id,
        section,
        content,
      }),
    );
    closeModal();
  };

  const { dialogStep, handleClick } = useAgreeDisagreeModal(isValid, trigger);

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      {dialogStep === 'form' ? (
        <>
          <div className={styles.h3}>
            Propose a Referendum -
            {legislation.sections[section]
              ? 'amend legislation'
              : 'add legislation section'}
          </div>

          <DisplayOnlyLegislation section={section} />

          <div className={styles.title}>Legislation Content</div>
          <TextInput
            required
            errorTitle="Content"
            register={register}
            name="content"
          />
          {errors?.content?.message && (
            <div className={styles.error}>{errors.content.message}</div>
          )}

          <ProposalDiscussionFields {...{ register, errors }} />

          <div className={styles.buttonWrapper}>
            <Button medium onClick={closeModal}>
              Cancel
            </Button>
            <Button primary medium onClick={handleClick}>
              Submit
            </Button>
          </div>
        </>
      ) : (
        <AgreeDisagreeModal onDisagree={closeModal} agreeButtonType="submit" />
      )}
    </form>
  );
}

ProposeAmendLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function ProposeAmendLegislationModalWrapper(props) {
  return (
    <ModalRoot>
      <ProposeAmendLegislationModal {...props} />
    </ModalRoot>
  );
}

export default ProposeAmendLegislationModalWrapper;
