import React from 'react';
import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import { proposalHeading } from '../utils';
import Button from '../../Button/Button';

function ProposalLink({
  tabledProposals,
  type,
  identifier,
  values,
  setTabledProposals,
}) {
  React.useEffect(() => {
    const fromType = tabledProposals[type];
    const fromKey = fromType[identifier] || [];
    const hasStateChanged = values.length !== fromKey.length || values.some((v, i) => v !== fromKey[i]);
    if (hasStateChanged) {
      setTabledProposals((proposals) => ({
        ...proposals,
        [type]: {
          ...proposals[type],
          [identifier]: values,
        },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, type, values]);

  return (
    <Button
      nano
      primary
      onClick={
        () => {
          const row = document.querySelector(`#hash${objectHash(identifier)}`);
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
  values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default ProposalLink;
