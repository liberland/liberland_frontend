import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../Card';
import Button from '../../Button/Button';
import ProposalDetailsModal from '../../Modals/ProposalDetailsModal';
import ProgressBar from '../../ProgressBar';

import { assemblyActions } from '../../../redux/actions';
import { assemblySelectors, votingSelectors } from '../../../redux/selectors';

import styles from './styles.module.scss';
import { ReactComponent as PassedImage } from '../../../assets/icons/passed.svg';
import { ReactComponent as VetoedImage } from '../../../assets/icons/vetoed.svg';
import { ReactComponent as DeclinedImage } from '../../../assets/icons/declined.svg';
import { ReactComponent as AddNewDraftImage } from '../../../assets/icons/add-new-draft.svg';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { AddNewDraftModal, EditDraftModal } from '../../Modals';

const MyDrafts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState({});
  const [proposalModalProps, setproposalModalProps] = useState({});
  const dispatch = useDispatch();
  const texFromPdf = useSelector(assemblySelectors.textPdfSelector);
  const liberStakeAmount = useSelector(votingSelectors.selectorLiberStakeAmount);

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  const handleWorkerCall = (id) => {
    dispatch(assemblyActions.getTextPdf.call(id));
    setproposalModalProps({ ...proposalModalProps, proposalModalShown: 1 });
  };

  const handleProposalModalOpen = (proposal) => {
    setIsProposalModalOpen(!isProposalModalOpen);
    setproposalModalProps({ ...proposal, proposalModalShown: 0 });
    dispatch(assemblyActions.getTextPdf.call(proposal.id));
  };

  const handleEditModalOpen = (draft) => {
    setIsEditModalOpen(!isEditModalOpen);
    setSelectedDraft(draft);
  };

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
      draft_type,
    } = values;
    if (file) {
      const data = {
        file: await toBase64(file),
        linkToGoogleDocument: link_to_Google_document,
        proposalName: proposal_name,
        shortDescription: short_description,
        threadLink: thread_link,
        requiredAmountLlm: liberStakeAmount,
        currentLlm: null,
        votingHourLeft: null,
        draftType: draft_type,
      };

      dispatch(assemblyActions.addMyDraft.call({ data }));
      handleModalOpen();
    }
  };

  const handleEdit = async (draft, file) => {
    const {
      link_to_Google_document,
      proposal_name,
      short_description,
      thread_link,
      draft_type,
    } = draft;
    if (!file) {
      // TODO add error handling, when no file is present
      return;
    }
    const data = {
      id: draft.id,
      file: await toBase64(file),
      linkToGoogleDocument: link_to_Google_document,
      proposalName: proposal_name,
      shortDescription: short_description,
      threadLink: thread_link,
      requiredAmountLlm: liberStakeAmount,
      draftType: draft_type,
    };

    dispatch(assemblyActions.editDraft.call(data));
    handleEditModalOpen();
  };

  const handleSubmitProposal = async (id) => {
    dispatch(assemblyActions.submitProposal.call(id));
  };

  const drafts = useSelector(assemblySelectors.proposalsSelector);

  const viewStatus = (draft) => {
    const { proposalStatus, votingHourLeft } = draft;
    switch (proposalStatus) {
      case 'Draft': return <span className={styles.draftNew}>{proposalStatus}</span>;
      case 'InProgress': return <span className={styles.draftVoting}>{`${proposalStatus} (${votingHourLeft}h left)`}</span>;
      case 'Approved': return (
        <div className={styles.imageAndStatus}>
          <PassedImage />
          <span className={styles.draftPassed}>
            {proposalStatus}
          </span>
        </div>
      );
      case 'Vetoed': return (
        <div className={styles.imageAndStatus}>
          <VetoedImage />
          <span className={styles.draftVetoed}>
            {proposalStatus}
          </span>
        </div>
      );
      case 'Declined': return (
        <div className={styles.imageAndStatus}>
          <DeclinedImage />
          <span className={styles.draftDeclined}>
            {proposalStatus}
          </span>
        </div>
      );
      default: return (<span> status error</span>);
    }
  };

  useEffect(() => {
    dispatch(assemblyActions.getMyProposals.call());
  }, [dispatch]);

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
            <br />
            <span>
              {draft.draftType === 'ConstitutionalChange' ? 'Constitutional change' : draft.draftType}
            </span>
            {draft.proposalStatus === 'Draft' && (
              <div className={styles.draftButtons}>
                <Button
                  onClick={() => handleSubmitProposal(draft.id)}
                  primary
                  little
                  className={styles.submitButton}
                >
                  submit
                </Button>
                <div className={styles.editButtonStatus}>
                  <Button
                    nano
                    grey
                    className={styles.editDraftButton}
                    onClick={() => handleEditModalOpen(draft)}
                  >
                    edit
                  </Button>
                  {viewStatus(draft)}
                </div>
              </div>
            )}
            {draft.proposalStatus !== 'Draft' && (
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
                  <Button
                    nano
                    grey
                    className={styles.detailsButton}
                    onClick={() => handleProposalModalOpen(draft)}
                  >
                    details
                  </Button>
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
      {isEditModalOpen && (
        <EditDraftModal
          onSubmit={handleEdit}
          closeModal={handleEditModalOpen}
          draft={selectedDraft}
          closeEditModal={handleEditModalOpen}
        />
      )}
      {isProposalModalOpen && (
        <ProposalDetailsModal
          proposal={proposalModalProps}
          closeModal={handleProposalModalOpen}
          goToProposal={handleWorkerCall}
          texFromPdf={texFromPdf}
        />
      )}
    </Card>
  );
};

export default MyDrafts;
