import React, { useState, useCallback, useRef } from 'react';
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
import { ProposalDiscussionFields } from '../ProposalDiscussionFields';
import AgreeDisagreeModal from '../../../../Modals/AgreeDisagreeModal';
import ModalRoot from '../../../../Modals/ModalRoot';
import stylesModal from '../../../../Modals/styles.module.scss';
import stylesPage from '../../../../../utils/pagesBase.module.scss';

export function AddLegislation() {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    democracySelectors.selectorGettingDemocracyInfo,
  );
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef();

  const handleModalOpen = () => setIsModalOpen((prevState) => !prevState);

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    control,
    watch,
    trigger,
  } = useForm({
    mode: 'all',
    defaultValues: {
      tier: 'Law',
      sections: [{ value: 'Paste markdown to autosplit sections' }],
    },
  });

  const handleClick = useCallback(() => {
    trigger();
    if (isValid) {
      handleModalOpen();
    }
  }, [isValid, trigger]);

  if (!isLoading && shouldRedirect) { return <Redirect to={router.voting.referendum} />; }

  const propose = ({
    tier,
    index,
    discussionName,
    discussionDescription,
    discussionLink,
    sections: sectionsRaw,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(
      democracyActions.propose.call({
        tier,
        index,
        discussionName,
        discussionDescription,
        discussionLink,
        sections,
      }),
    );
    setShouldRedirect(true);
  };

  return (
    <form onSubmit={handleSubmit(propose)} className={stylesPage.contentWrapper}>
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

      <div className={styles.title}>Legislation Index</div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="Index"
        register={register}
        name="index"
      />
      {errors?.index?.message ? (
        <div className={styles.error}>{errors.index.message}</div>
      ) : null}

      <ProposalDiscussionFields
        {...{
          register,
          errors,
        }}
      />

      <AddLegislationFields
        {...{
          register,
          control,
          errors,
          watch,
        }}
      />

      <div className={styles.buttonWrapper}>
        <Button primary medium onClick={handleClick}>
          Submit
        </Button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="submit" ref={buttonRef} style={{ display: 'none' }} />
      {isModalOpen && (
        <ModalRoot>
          <AgreeDisagreeModal
            onDisagree={handleModalOpen}
            onAgree={() => {
              handleModalOpen();
              buttonRef.current.click();
            }}
            style={stylesModal.getCitizenshipModal}
          />
        </ModalRoot>
      )}
    </form>
  );
}
