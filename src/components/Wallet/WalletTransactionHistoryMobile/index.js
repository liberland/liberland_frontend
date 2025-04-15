/* eslint-disable react/prop-types */
import React from 'react';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import classNames from 'classnames';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import HistoryCopyIconWithAddress from '../HistoryCopyIconWithAddress';
import styles from './styles.module.scss';
import WalletHistoryAmount from '../WalletHistoryAmount';
import { getDefaultPageSizes } from '../../../utils/pageSize';

function WalletTransactionHistoryMobile({ failure, transactionHistory, filterTransactionsBy }) {
  return (
    <List
      pagination={getDefaultPageSizes(5)}
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
        logo,
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
              <div className={classNames('description', styles.date)}>
                {dateTransactionHistory}
              </div>
            )}
            title={(
              <Flex gap="5px" align="center" className={styles.title}>
                <Avatar size={24} src={iconType} alt={imgAlt} />
                <span className={styles.type}>
                  {typeText}
                </span>
              </Flex>
            )}
          >
            <Flex vertical gap="30px">
              <Card.Meta
                description={(
                  <WalletHistoryAmount currency={currency} value={asset} logo={logo} isTitle />
                )}
              />
              <Flex wrap className={styles.actions} gap="15px" justify="space-between" align="center">
                <HistoryCopyIconWithAddress
                  address={userId}
                />
                <CheckCircleOutlined className={styles.success} />
              </Flex>
            </Flex>
          </Card>
        </List.Item>
      )}
    />
  );
}

export default WalletTransactionHistoryMobile;
