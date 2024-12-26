import { useEffect } from 'react';
import PropTypes from 'prop-types';

function ProposalController({
  tabledProposals,
  identifier,
  values,
  setTabledProposals,
}) {
  useEffect(() => {
    const fromType = tabledProposals || {};
    const fromKey = fromType[identifier] || {};
    const fromEntries = Object.values(fromKey);
    const valuesEntries = Object.values(values);
    const hasStateChanged = valuesEntries.length !== fromEntries.length
      || valuesEntries.some((v, i) => v !== fromEntries[i]);
    if (hasStateChanged) {
      setTabledProposals((proposals) => ({
        ...proposals,
        [identifier]: values,
      }));
    }
  }, [identifier, setTabledProposals, tabledProposals, values]);

  return null;
}

ProposalController.propTypes = {
  tabledProposals: PropTypes.shape({}).isRequired,
  identifier: PropTypes.string.isRequired,
  setTabledProposals: PropTypes.func.isRequired,
  values: PropTypes.shape({}).isRequired,
};

export default ProposalController;
