/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React from 'react';

import Table from 'antd/es/table';
import Flex from 'antd/es/flex';
import Tag from 'antd/es/tag';

import CopyIconWithAddress from '../../CopyIconWithAddress';

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
              <img src={record.iconType} alt={record.imgAlt} />
              <span>
                {value}
              </span>
            </Flex>
          ),
        },
        {
          title: 'Payment number',
          dataIndex: 'userId',
          key: 'userId',
          render: (value) => (
            <CopyIconWithAddress
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
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: () => (
            <Tag color="#79BF2E">
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
