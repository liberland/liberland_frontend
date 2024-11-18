import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import { useProposalContext } from '../ProposalContext';
import { proposalHeading, proposalTableHeadings } from '../utils';
import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from '../../Table/styles.module.scss';
import Card from '../../Card';

function ProposalTable({ type }) {
  const headings = useMemo(
    () => proposalTableHeadings(type),
    [type],
  );

  const { data } = useProposalContext();

  const rows = Object.entries(data[type] || {});

  if (!rows.length) {
    return null;
  }

  return (
    <Card title={proposalHeading(type)} className={stylesPage.overviewWrapper}>
      <div className={styles.tableScrollContainer}>
        <div className={styles.tableInnerScrollContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {headings.map((heading) => (
                  <th key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {rows.map(([key, row]) => (
                <tr id={`hash${objectHash(key)}`} key={key} tabIndex={0}>
                  {row.map((cell, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <td key={`${cell}-${index}`}>
                      <div className={styles.bigTextContainer}>
                        {cell}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

ProposalTable.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ProposalTable;
