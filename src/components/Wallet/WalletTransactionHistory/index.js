/* eslint-disable react/prop-types */
import React from 'react';
import Table from 'antd/es/table';
import Flex from 'antd/es/flex';
import Tag from 'antd/es/tag';
import Avatar from 'antd/es/avatar';
import AsyncCopyIconWithAddress from '../../AsyncCopyIconWithAddress';
import styles from './styles.module.scss';
import WalletHistoryAmount from '../WalletHistoryAmount';

function WalletTransactionHistory({ failure, transactionHistory, filterTransactionsBy }) {
  return (
    <Table
      pagination={{ showSizeChanger: true }}
      columns={[
        {
          title: 'Type',
          dataIndex: 'typeText',
          key: 'typeText',
          render: (value, record) => (
            <Flex gap="20px" align="center">
              <Avatar size={24} src={record.iconType} alt={record.imgAlt} />
              <span>
                {value}
              </span>
            </Flex>
          ),
        },
        {
          title: 'Payment address',
          dataIndex: 'userId',
          key: 'userId',
          render: (value) => (
            <AsyncCopyIconWithAddress
              address={value}
            />
          ),
        },
        {
          title: 'Date and time',
          dataIndex: 'dateTransactionHistory',
          key: 'dateTransactionHistory',
        },
        {
          title: 'Amount',
          dataIndex: 'asset',
          key: 'asset',
          render: (value, { currency }) => (
            <WalletHistoryAmount currency={currency} value={value} />
          ),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: () => (
            <Tag className={styles.success} color="white">
              Successful
            </Tag>
          ),
        },
      ]}
      dataSource={failure
        ? []
        : transactionHistory
          .filter(({ typeText }) => !filterTransactionsBy || typeText === filterTransactionsBy)}
    />
  );
}

export default WalletTransactionHistory;
