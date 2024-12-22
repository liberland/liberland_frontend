import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { proposalHeading } from '../utils';
import Button from '../../Button/Button';

function ProposalLink({
  tabledProposals,
  type,
  identifier,
  values,
  setTabledProposals,
}) {
  useEffect(() => {
    const fromType = tabledProposals[type] || {};
    const fromKey = fromType[identifier] || [];
    const hasStateChanged = values.length !== fromKey.length || values.some((v, i) => v !== fromKey[i]);
    if (hasStateChanged) {
      setTabledProposals((proposals) => ({
        ...proposals,
        [type]: {
          ...proposals?.[type],
          [identifier]: values,
        },
      }));
    }
  }, [identifier, setTabledProposals, tabledProposals, type, values]);

  return (
    <Button
      nano
      primary
      onClick={
        () => {
          const row = document.querySelector(`#hash${identifier}`);
          if (row) {
            row.scrollIntoView();
            setTimeout(() => row.focus(), 50);
          }
        }
      }
    >
      Show:
      {' '}
      {proposalHeading(type)}
    </Button>
  );
}

ProposalLink.propTypes = {
  tabledProposals: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  setTabledProposals: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType(
      PropTypes.string.isRequired,
      PropTypes.node.isRequired,
    ),
  ).isRequired,
};

export default ProposalLink;
