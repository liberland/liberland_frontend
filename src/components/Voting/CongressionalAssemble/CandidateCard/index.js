import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button/Button';
import PoliticanCard from '../PoliticianCard';

function CandidateCard({ politician, selectCandidate }) {
  return (
    <PoliticanCard
      politician={politician}
      actions={[
        <Button
          primary
          onClick={() => selectCandidate(politician)}
        >
          Add vote
        </Button>,
      ]}
    />
  );
}

CandidateCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string,
    legal: PropTypes.string,
    website: PropTypes.string,
    rawIdentity: PropTypes.string.isRequired,
    identityData: PropTypes.shape({
      info: PropTypes.shape({
        web: PropTypes.shape({
          raw: PropTypes.string,
          none: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
  selectCandidate: PropTypes.func.isRequired,
};

export default CandidateCard;
