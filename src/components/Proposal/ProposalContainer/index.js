import React from 'react';
import PropTypes from 'prop-types';
import { ProposalProvider } from '../ProposalContext';
import ProposalTable from '../ProposalTable';

function ProposalContainer({ children, noTable }) {
  return (
    <ProposalProvider>
      {children}
      {!noTable && (
        <ProposalTable />
      )}
    </ProposalProvider>
  );
}

ProposalContainer.propTypes = {
  children: PropTypes.node.isRequired,
  noTable: PropTypes.bool,
};

export default ProposalContainer;
