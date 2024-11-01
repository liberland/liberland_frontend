import React from 'react';
import PropTypes from 'prop-types';
import { Proposal } from '..';
import styles from '../../Table/styles.module.scss';

function ProposalTable({ proposals, controls }) {
  const proposal = proposals[0];
  const {
    method,
    section,
  } = proposal.toHuman();

  const { headings, small } = React.useMemo(() => {
    if (method === 'transfer' && section === 'balances') {
      return {
        headings: [
          'Transfer',
          'To',
        ],
        small: true,
      };
    }
    if ((method === 'sendLlmToPolitipool' || method === 'sendLlm') && section === 'llm') {
      return {
        headings: [
          'Transfer',
          'To',
        ],
        small: true,
      };
    }
    if (method === 'transfer' && section === 'assets') {
      return {
        headings: [
          'Transfer',
          'To',
        ],
        small: true,
      };
    }
    if (method === 'remark' && section === 'llm') {
      return {
        headings: [
          'Category',
          'Project',
          'Supplier',
          'Description',
          'Currency',
          'Amount in USD',
          'Final Destination',
          'Date',
        ],
        small: false,
      };
    }
    // eslint-disable-next-line no-console
    console.warn(`Trying to display proposal ${method}/${section} as table. Unsupported`);
    return { headings: [], small: true };
  }, [method, section]);

  const hasControls = React.useMemo(() => controls?.some(Boolean), [controls]);

  return (
    <div className={styles.tableScrollContainer}>
      <div className={small ? styles.tableScrollSmallInnerContainer : styles.tableScrollBigInnerContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {headings.map((heading) => (
                <th key={heading}>
                  {heading}
                </th>
              ))}
              {hasControls && (
                <th>
                  Controls
                </th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {proposals.map((prop, index) => (
              <tr key={prop}>
                <Proposal proposal={prop} isTableRow />
                {hasControls && (
                  <td>
                    {controls[index]}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ProposalTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposals: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  controls: PropTypes.arrayOf(PropTypes.node),
};

export default ProposalTable;
