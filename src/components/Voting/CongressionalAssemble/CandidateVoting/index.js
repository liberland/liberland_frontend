import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import CandidateCard from '../CandidateCard';
import SelectedCandidateCard from '../SelectedCandidateCard';
import Button from '../../../Button/Button';

function CandidateVoting({
  eligibleUnselectedCandidates,
  selectedCandidates,
  selectCandidate,
  unselectCandidate,
  moveSelectedCandidate,
  didChangeSelectedCandidates,
  handleUpdate,
}) {
  return (
    <Collapse
      defaultActiveKey={['voting', 'preference']}
      items={[
        {
          key: 'voting',
          label: 'Voting',
          children: (
            <List
              dataSource={eligibleUnselectedCandidates}
              renderItem={(eligibleUnselectedCandidate) => (
                <CandidateCard
                  politician={eligibleUnselectedCandidate}
                  selectCandidate={selectCandidate}
                />
              )}
            />
          ),
        },
        {
          key: 'preference',
          label: 'My preference ordered Votes',
          extra: (
            <Button
              primary
              disabled={!didChangeSelectedCandidates}
              onClick={() => handleUpdate()}
            >
              Update vote
            </Button>
          ),
          children: (
            <List
              dataSource={selectedCandidates}
              renderItem={(currentCandidateVoteByUser) => (
                <SelectedCandidateCard
                  politician={currentCandidateVoteByUser}
                  unselectCandidate={unselectCandidate}
                  moveSelectedCandidate={moveSelectedCandidate}
                />
              )}
            />
          ),
        },
      ]}
    />
  );
}

const candidate = PropTypes.shape({
  name: PropTypes.string.isRequired,
  rawIdentity: PropTypes.string.isRequired,
});

CandidateVoting.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  eligibleUnselectedCandidates: PropTypes.arrayOf(candidate).isRequired,
  selectedCandidates: PropTypes.arrayOf(candidate).isRequired,
  selectCandidate: PropTypes.func.isRequired,
  unselectCandidate: PropTypes.func.isRequired,
  moveSelectedCandidate: PropTypes.func.isRequired,
  didChangeSelectedCandidates: PropTypes.bool.isRequired,
};

export default CandidateVoting;
