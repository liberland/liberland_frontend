import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useProposalContext } from '../ProposalContext';
import { proposalHeading, proposalTableHeadings } from '../utils';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Table from '../../Table';
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
      <Table
        columns={headings.map((heading, index) => ({
          Header: heading,
          accessor: index.toString(),
        }))}
        data={rows.map(([_, values]) => values.reduce((map, value, index) => {
          map[index.toString()] = value;
          return map;
        }, {}))}
      />
    </Card>
  );
}

ProposalTable.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ProposalTable;
