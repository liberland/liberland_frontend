import React from 'react';
import PropTypes from 'prop-types';
import { ProposalProvider } from '../ProposalContext';
import ProposalTable from '../ProposalTable';

function ProposalContainer({ children }) {
  return (
    <ProposalProvider>
      {children}
      <ProposalTable type="remarkedTransfer" />
      <ProposalTable type="transferLLD" />
      <ProposalTable type="transferLLM" />
      <ProposalTable type="transferAsset" />
      <ProposalTable type="remarks" />
    </ProposalProvider>
  );
}

ProposalContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProposalContainer;
