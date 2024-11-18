import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import ProposalLink from '../ProposalLink';

const ProposalContext = createContext({ data: {} });

export function ProposalProvider({
  children,
}) {
  const [tabledProposals, setTabledProposals] = useState({});
  const addTabledProposal = useCallback(
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
  const context = useMemo(() => ({
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

export const useProposalContext = () => useContext(ProposalContext);

ProposalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
