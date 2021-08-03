import React from 'react';
import Card from '../../Card';

const MyDrafts = () => {
  const draftStatuses = ['draft', 'voting', 'passed', 'vetoed', 'declined'];
  const drafts = [
    {
      id: 1,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 0,
      requiredAmountLlm: 21430,
      currentLlm: 430,
      votingHourLeft: null,
    },
    {
      id: 2,
      title: 'Change lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 1,
      requiredAmountLlm: 21430,
      currentLlm: 21430,
      votingHourLeft: 72,
    },
    {
      id: 3,
      title: 'Change lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 2,
      requiredAmountLlm: 21430,
      currentLlm: 470,
      votingHourLeft: null,
    },
    {
      id: 4,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 3,
      requiredAmountLlm: 21430,
      currentLlm: 430,
      votingHourLeft: null,
    },
    {
      id: 5,
      title: 'Create lorem ipsum dolor sit consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra sagittis.',
      statusDraft: 4,
      requiredAmountLlm: 21430,
      currentLlm: 430,
      votingHourLeft: null,
    },
  ];

  const viewStatus = (draft) => {
    const { statusDraft, votingHourLeft } = draft;
    switch (statusDraft) {
      case 0: return <span>{draftStatuses[statusDraft]}</span>;
      case 1: return <span>{`${draftStatuses[statusDraft]} (${votingHourLeft}h left)`}</span>;
      case 2: return <span>{draftStatuses[statusDraft]}</span>;
      case 3: return <span>{draftStatuses[statusDraft]}</span>;
      case 4: return <span>{draftStatuses[statusDraft]}</span>;
      default: return (<span> status error</span>);
    }
  };

  return (
    <Card>
      {drafts.map((draft) => (
        <div key={draft.id}>
          <h3>
            {draft.title}
          </h3>
          <span>
            {draft.content}
          </span>
          {draft.statusDraft === 0 && (
            <div>
              <button>submit</button>
              {viewStatus(draft)}
            </div>
          )}
          {draft.statusDraft > 0 && (
            <div>
              <button>edit</button>
              {viewStatus(draft)}
            </div>
          )}
        </div>
      ))}
      <div>
        <span>
          My drafts
        </span>
      </div>
    </Card>
  );
};

export default MyDrafts;
