import React from 'react';
import PropTypes from 'prop-types';
import { Proposal } from '..';

function ProposalTable({ proposals, controls }) {
  const proposal = proposals[0];
  const {
    method,
    section,
  } = proposal.toHuman();

  const headings = React.useMemo(() => {
    if (method === 'transfer' && section === 'balances') {
      return [
        'Transfer',
        'To',
      ];
    }
    if ((method === 'sendLlmToPolitipool' || method === 'sendLlm') && section === 'llm') {
      return [
        'Transfer',
        'To',
      ];
    }
    if (method === 'transfer' && section === 'assets') {
      return [
        'Transfer',
        'To',
      ];
    }
    if (method === 'remark' && section === 'llm') {
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
    console.warn(`Trying to display proposal ${method}/${section} as table. Unsupported`);
    return [];
  }, [method, section]);

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
  controls: PropTypes.arrayOf(PropTypes.node),
};

export default ProposalTable;
