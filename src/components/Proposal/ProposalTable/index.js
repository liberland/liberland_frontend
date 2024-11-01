import React from 'react';
import PropTypes from 'prop-types';
import { Proposal } from '..';

function ProposalTable({ proposals, controls }) {
  const proposal = proposals[0];
  const proposalMethod = proposal.method;
  const proposalSection = proposal.section;

  const headings = React.useMemo(() => {
    if (proposalMethod === 'transfer' && proposalSection === 'balances') {
      return [
        'Transfer',
        'To',
      ];
    }
    if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
      return [
        'Transfer',
        'To',
      ];
    }
    if (proposalMethod === 'transfer' && proposalSection === 'assets') {
      return [
        'Transfer',
        'To',
      ];
    }
    if (proposalMethod === 'remark' && proposalSection === 'llm') {
      return [
        'Category',
        'Project',
        'Supplier',
        'Description',
        'Currency',
        'Amount in USD',
        'Final Destination',
        'Date',
      ];
    }
    // eslint-disable-next-line no-console
    console.warn(`Trying to display proposal ${proposalMethod}/${proposalSection} as table. Unsupported`);
    return [];
  }, [proposalMethod, proposalSection]);

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>
              {heading}
            </th>
          ))}
          {controls && (
            <th>
              Controls
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {proposals.map((prop, index) => (
          <tr key={prop}>
            <Proposal proposal={prop} isTableRow />
            {controls && (
              <td>
                {controls[index]}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ProposalTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposals: PropTypes.shape(PropTypes.object.isRequired).isRequired,
  controls: PropTypes.arrayOf(PropTypes.node.isRequired),
};

export default ProposalTable;
