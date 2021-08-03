import React from 'react';
import Card from '../../Card';
import Button from '../../Button/Button';

import ProgressBar from '../../ProgressBar';

import styles from './styles.module.scss';
import { ReactComponent as PassedImage } from '../../../assets/icons/passed.svg';
import { ReactComponent as VetoedImage } from '../../../assets/icons/vetoed.svg';
import { ReactComponent as DeclinedImage } from '../../../assets/icons/declined.svg';

const MyDrafts = () => {
  const draftStatuses = ['draft', 'voting', 'passed', 'vetoed', 'declined'];
  const drafts = [
    {
      id: 1,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 0,
      requiredAmountLlm: 21430,
      currentLlm: 2430,
      votingHourLeft: null,
    },
    {
      id: 2,
      title: 'Change lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 1,
      requiredAmountLlm: 21430,
      currentLlm: 3470,
      votingHourLeft: 72,
    },
    {
      id: 3,
      title: 'Change lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 2,
      requiredAmountLlm: 21430,
      currentLlm: 21430,
      votingHourLeft: null,
    },
    {
      id: 4,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 3,
      requiredAmountLlm: 21430,
      currentLlm: 4430,
      votingHourLeft: null,
    },
    {
      id: 5,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 4,
      requiredAmountLlm: 21430,
      currentLlm: 7430,
      votingHourLeft: null,
    },
  ];

  const viewStatus = (draft) => {
    const { statusDraft, votingHourLeft } = draft;
    switch (statusDraft) {
      case 0: return <span className={styles.draftNew}>{draftStatuses[statusDraft]}</span>;
      case 1: return <span className={styles.draftVoting}>{`${draftStatuses[statusDraft]} (${votingHourLeft}h left)`}</span>;
      case 2: return (
        <div>
          <PassedImage />
          <span className={styles.draftPassed}>
            {draftStatuses[statusDraft]}
          </span>
        </div>
      );
      case 3: return (
        <div>
          <VetoedImage />
          <span className={styles.draftVetoed}>
            {draftStatuses[statusDraft]}
          </span>
        </div>
      );
      case 4: return (
        <div>
          <DeclinedImage />
          <span className={styles.draftDeclined}>
            {draftStatuses[statusDraft]}
          </span>
        </div>
      );
      default: return (<span> status error</span>);
    }
  };

  return (
    <Card>
      <div className={styles.draftHeader}>
        <span>
          My drafts
          {`(${drafts.length})`}
        </span>
      </div>
      <div className={styles.draftWrapper}>
        {drafts.map((draft) => (
          <div className={styles.singleDraft} key={draft.id}>
            <h3>
              {draft.title}
            </h3>
            <span>
              {draft.content}
            </span>
            {draft.statusDraft === 0 && (
              <div className={styles.draftButtons}>
                <Button primary little className={styles.submitButton}>submit</Button>
                <div className={styles.editButtonStatus}>
                  <Button nano grey className={styles.editDraftButton}>edit</Button>
                  {viewStatus(draft)}
                </div>
              </div>
            )}
            {draft.statusDraft > 0 && (
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
    </Card>
  );
};

export default MyDrafts;
