import React, { useMemo } from 'react';
import objectHash from 'object-hash';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import { useProposalContext } from '../ProposalContext';
import { proposalHeading, proposalTableHeadings } from '../utils';
import Table from '../../Table';

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
    <>
      <Title level={3}>
        {proposalHeading(type)}
      </Title>
      <Table
        columns={headings.map((heading, index) => ({
          Header: heading,
          accessor: index.toString(),
        }))}
        data={rows.map(([key, values]) => values.reduce((map, value, index) => {
          map[index.toString()] = value;
          return map;
        }, { hash: objectHash(key) }))}
      />
    </>
  );
}

ProposalTable.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ProposalTable;
