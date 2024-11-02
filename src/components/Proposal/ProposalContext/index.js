import React from 'react';
import PropTypes from 'prop-types';
import ProposalLink from '../ProposalLink';

const ProposalContext = React.createContext({ data: {} });

export function ProposalProvider({
  children,
}) {
  const [tabledProposals, setTabledProposals] = React.useState({});
  const addTabledProposal = React.useCallback(
    (type, identifier, values) => (
      <ProposalLink
        identifier={identifier}
        setTabledProposals={setTabledProposals}
        tabledProposals={tabledProposals}
        type={type}
        values={values}
      />
    ),
    [tabledProposals],
  );
  const context = React.useMemo(() => ({
    data: tabledProposals,
    addTabledProposal,
  }), [
    tabledProposals,
    addTabledProposal,
  ]);
  return (
    <ProposalContext.Provider value={context}>
      {children}
    </ProposalContext.Provider>
  );
}

export const useProposalContext = () => React.useContext(ProposalContext);

ProposalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
