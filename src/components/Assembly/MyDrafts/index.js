import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../Card';
import Button from '../../Button/Button';

import ProgressBar from '../../ProgressBar';

import { assemblyActions } from '../../../redux/actions';
import { assemblySelectors } from '../../../redux/selectors';

import styles from './styles.module.scss';
import { ReactComponent as PassedImage } from '../../../assets/icons/passed.svg';
import { ReactComponent as VetoedImage } from '../../../assets/icons/vetoed.svg';
import { ReactComponent as DeclinedImage } from '../../../assets/icons/declined.svg';
import { ReactComponent as AddNewDraftImage } from '../../../assets/icons/add-new-draft.svg';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { AddNewDraftModal } from '../../Modals';

const MyDrafts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleSubmit = async (values) => {
    const {
      file,
      link_to_Google_document,
      proposal_name,
      short_description,
      thread_link,
    } = values;
    const data = {
      file: await toBase64(file),
      linkToGoogleDocument: link_to_Google_document,
      proposalName: proposal_name,
      shortDescription: short_description,
      threadLink: thread_link,
      requiredAmountLlm: null,
      currentLlm: null,
      votingHourLeft: null,
    };
    dispatch(assemblyActions.addMyDraft.call({ data }));
    // handleModalOpen();
  };
  const draftStatuses = ['draft', 'voting', 'passed', 'vetoed', 'declined'];
  const drafts = useSelector(assemblySelectors.proposalsSelector);
  const viewStatus = (draft) => {
    const { proposalStatus, votingHourLeft } = draft;
    switch (proposalStatus) {
      case 0: return <span className={styles.draftNew}>{draftStatuses[proposalStatus]}</span>;
      case 1: return <span className={styles.draftVoting}>{`${draftStatuses[proposalStatus]} (${votingHourLeft}h left)`}</span>;
      case 2: return (
        <div className={styles.imageAndStatus}>
          <PassedImage />
          <span className={styles.draftPassed}>
            {draftStatuses[proposalStatus]}
          </span>
        </div>
      );
      case 3: return (
        <div className={styles.imageAndStatus}>
          <VetoedImage />
          <span className={styles.draftVetoed}>
            {draftStatuses[proposalStatus]}
          </span>
        </div>
      );
      case 4: return (
        <div className={styles.imageAndStatus}>
          <DeclinedImage />
          <span className={styles.draftDeclined}>
            {draftStatuses[proposalStatus]}
          </span>
        </div>
      );
      default: return (<span> status error</span>);
    }
  };

  useEffect(() => dispatch(assemblyActions.getMyProposals.call()), [dispatch]);

  return (
    <Card>
      <div className={styles.draftHeader}>
        <span>
          My drafts
          {`(${drafts && drafts.length})`}
        </span>

        <div className={styles.buttonWrapper}>
          <Button className={styles.searchButton}><SearchIcon /></Button>
        </div>
      </div>
      <div className={styles.draftWrapper}>
        <div className={styles.addNewDraft} onClick={() => handleModalOpen()}>
          <AddNewDraftImage />
          <h3>
            Add New Draft
          </h3>
          <span>
            Create new lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Ipsum pharetra sagittis.
          </span>
        </div>
        { drafts && drafts.map((draft) => (
          <div className={styles.singleDraft} key={draft.id}>
            <h3>
              {draft.proposalName}
            </h3>
            <span>
              {draft.shortDescription}
            </span>
            {draft.proposalStatus === 0 && (
              <div className={styles.draftButtons}>
                <Button primary little className={styles.submitButton}>submit</Button>
                <div className={styles.editButtonStatus}>
                  <Button nano grey className={styles.editDraftButton}>edit</Button>
                  {viewStatus(draft)}
                </div>
              </div>
            )}
            {draft.proposalStatus > 0 && (
              <>
                <p>
                  {`${draft.currentLlm}/${draft.requiredAmountLlm} llm`}
                </p>
                <ProgressBar
                  percent={0}
                  maxValue={draft.requiredAmountLlm}
                  currentValue={draft.currentLlm}
                />
                <div className={styles.editButtonStatus}>
                  <Button nano grey className={styles.detailsButton}>details</Button>
                  {viewStatus(draft)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <AddNewDraftModal
          onSubmit={handleSubmit}
          closeModal={handleModalOpen}
        />
      )}
    </Card>
  );
};

export default MyDrafts;
