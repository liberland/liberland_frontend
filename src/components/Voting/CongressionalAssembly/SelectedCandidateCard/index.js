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
      isSelected
      preActions={[
        candidateIndex !== 0 && candidatesLength !== 1 && moveSelectedCandidate && (
          <Button primary link onClick={() => moveSelectedCandidate(-1)}>
            <ArrowUpOutlined aria-label="Move up" />
          </Button>
        ),
        candidateIndex !== candidatesLength - 1 && moveSelectedCandidate && candidatesLength !== 1 && (
          <Button red link onClick={() => moveSelectedCandidate(1)}>
            <ArrowDownOutlined aria-label="Move down" />
          </Button>
        ),
      ].filter(Boolean)}
      actions={unselectCandidate ? [
        <Button red onClick={() => unselectCandidate(politician)}>
          Remove
        </Button>,
      ] : undefined}
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
  unselectCandidate: PropTypes.func,
  moveSelectedCandidate: PropTypes.func,
  candidateIndex: PropTypes.number.isRequired,
  candidatesLength: PropTypes.number.isRequired,
};

export default SelectedCandidateCard;
