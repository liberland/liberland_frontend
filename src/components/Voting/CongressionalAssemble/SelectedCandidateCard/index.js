import React from 'react';
import PropTypes from 'prop-types';
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import PoliticanCard from '../PoliticianCard';
import Button from '../../../Button/Button';

function SelectedCandidateCard({
  politician, unselectCandidate, moveSelectedCandidate,
}) {
  return (
    <PoliticanCard
      politician={politician}
      actions={[
        <Button red onClick={() => unselectCandidate(politician)}>
          Remove
        </Button>,
        <Button link onClick={() => moveSelectedCandidate(politician, 'up')}>
          <ArrowUpOutlined color="green" aria-label="Move up" />
        </Button>,
        <Button link onClick={() => moveSelectedCandidate(politician, 'down')}>
          <ArrowDownOutlined color="red" aria-label="Move down" />
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
};

export default SelectedCandidateCard;
