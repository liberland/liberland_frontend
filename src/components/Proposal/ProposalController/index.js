import useEffect from 'react';
import PropTypes from 'prop-types';

function ProposalLink({
  tabledProposals,
  identifier,
  values,
  setTabledProposals,
}) {
  useEffect(() => {
    const fromType = tabledProposals || {};
    const fromKey = fromType[identifier] || [];
    const hasStateChanged = values.length !== fromKey.length || values.some((v, i) => v !== fromKey[i]);
    if (hasStateChanged) {
      setTabledProposals((proposals) => ({
        ...proposals,
        [identifier]: values,
      }));
    }
  }, [identifier, setTabledProposals, tabledProposals, values]);

  return null;
}

ProposalLink.propTypes = {
  tabledProposals: PropTypes.shape({}).isRequired,
  identifier: PropTypes.string.isRequired,
  setTabledProposals: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.node.isRequired,
    ]),
  ).isRequired,
};

export default ProposalLink;
