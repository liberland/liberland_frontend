import React from 'react';
import PropTypes from 'prop-types';
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import PoliticanCard from '../PoliticianCard';
import Button from '../../../Button/Button';

function SelectedCandidateCard({
  politician,
  unselectCandidate,
  moveSelectedCandidate,
  candidateIndex,
  candidatesLength,
}) {
  return (
    <PoliticanCard
      politician={politician}
      preActions={[
        candidateIndex !== 0 && candidatesLength !== 1 && (
          <Button link onClick={() => moveSelectedCandidate(politician, 'up')}>
            <ArrowUpOutlined aria-label="Move up" />
          </Button>
        ),
        candidateIndex !== candidatesLength - 1 && candidatesLength !== 1 && (
          <Button link onClick={() => moveSelectedCandidate(politician, 'down')}>
            <ArrowDownOutlined aria-label="Move down" />
          </Button>
        ),
      ].filter(Boolean)}
      actions={[
        <Button red onClick={() => unselectCandidate(politician)}>
          Remove
        </Button>,
      ]}
    />
  );
}

SelectedCandidateCard.propTypes = {
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
  unselectCandidate: PropTypes.func.isRequired,
  moveSelectedCandidate: PropTypes.func.isRequired,
  candidateIndex: PropTypes.number.isRequired,
  candidatesLength: PropTypes.number.isRequired,
};

export default SelectedCandidateCard;
