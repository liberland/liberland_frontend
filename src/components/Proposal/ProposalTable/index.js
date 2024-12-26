import React from 'react';
import Title from 'antd/es/typography/Title';
import { useProposalContext } from '../ProposalContext';
import Table from '../../Table';
import styles from './styles.module.scss';

function ProposalTable() {
  const { data } = useProposalContext();

  const rows = Object.values(data || {});

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
            Header: 'Transfer',
            accessor: 'transfer',
          },
          {
            Header: 'Amount in USD',
            accessor: 'amountInUsd',
          },
          {
            Header: 'Category',
            accessor: 'category',
          },
          {
            Header: 'Project',
            accessor: 'project',
          },
          {
            Header: 'Supplier',
            accessor: 'supplier',
          },
          {
            Header: 'Description',
            accessor: 'description',
          },
          {
            Header: 'Currency',
            accessor: 'currency',
          },
          {
            Header: 'Final destination',
            accessor: 'finalDestination',
          },
          {
            Header: 'Date',
            accessor: 'formattedDate',
          },
          {
            Header: 'To',
            accessor: 'to',
          },
        ]}
        data={rows}
      />
    </div>
  );
}

export default ProposalTable;
