/* eslint-disable react/prop-types */
import React from 'react';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import HistoryCopyIconWithAddress from '../HistoryCopyIconWithAddress';
import styles from './styles.module.scss';
import WalletHistoryAmount from '../WalletHistoryAmount';
import { useIdentitiesDispatch } from '../HistoryCopyIconWithAddress/hooks';

function WalletTransactionHistoryMobile({ failure, transactionHistory, filterTransactionsBy }) {
  useIdentitiesDispatch(transactionHistory?.map(({ userId }) => userId) || []);
  return (
    <List
      pagination={{ pageSize: 5 }}
      dataSource={failure
        ? []
        : transactionHistory
          .filter(({ typeText }) => !filterTransactionsBy || typeText === filterTransactionsBy)}
      renderItem={({
        typeText,
        userId,
        dateTransactionHistory,
        asset,
        currency,
        iconType,
        imgAlt,
      }) => (
        <List.Item>
          <Card
            className={styles.card}
            size="small"
            classNames={{
              header: styles.header,
              title: styles.title,
            }}
            extra={(
              <div className="description">
                {dateTransactionHistory}
              </div>
            )}
            title={(
              <Flex gap="5px" align="center">
                <Avatar size={24} src={iconType} alt={imgAlt} />
                <span>
                  {typeText}
                </span>
              </Flex>
            )}
            actions={[
              <Flex wrap className={styles.actions} gap="15px" justify="space-between" align="center">
                <HistoryCopyIconWithAddress
                  address={userId}
                />
                <CheckCircleOutlined className={styles.success} />
              </Flex>,
            ]}
          >
            <Card.Meta
              description={(
                <WalletHistoryAmount currency={currency} value={asset} isTitle />
              )}
            />
          </Card>
        </List.Item>
      )}
    />
  );
}

export default WalletTransactionHistoryMobile;
