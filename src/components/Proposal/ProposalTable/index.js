import React from 'react';
import Title from 'antd/es/typography/Title';
import { useProposalContext } from '../ProposalContext';
import Table from '../../Table';
import styles from './styles.module.scss';

function ProposalTable() {
  const { data } = useProposalContext();

  const rows = Object.entries(data || {});

  if (!rows.length) {
    return null;
  }

  return (
    <div className={styles.tableWrapper}>
      <Title level={5}>
        Transfers
      </Title>
      <Table
        columns={[
          {
            Heading: 'Transfer',
            accessor: 'transfer',
          },
          {
            Heading: 'Amount in USD',
            accessor: 'amountInUsd',
          },
          {
            Heading: 'Category',
            accessor: 'category',
          },
          {
            Heading: 'Project',
            accessor: 'project',
          },
          {
            Heading: 'Supplier',
            accessor: 'supplier',
          },
          {
            Heading: 'Description',
            accessor: 'description',
          },
          {
            Heading: 'Currency',
            accessor: 'currency',
          },
          {
            Heading: 'Final destination',
            accessor: 'finalDestination',
          },
          {
            Heading: 'Date',
            accessor: 'formatedDate',
          },
          {
            Heading: 'To',
            accessor: 'to',
          },
        ]}
        data={rows}
      />
    </div>
  );
}

export default ProposalTable;
