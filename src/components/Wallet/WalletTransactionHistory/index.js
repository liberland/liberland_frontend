/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React from 'react';
import { useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';

import Table from 'antd/es/table';
import formatDate from '../../../utils/formatDate';
import paymentIcon from '../../../assets/icons/RedArrowCicrle.svg';
import reciveIcon from '../../../assets/icons/GreenArrowCircle.svg';
import Status from '../../Status';
import { formatMeritTransaction, formatDollarTransaction, formatAssetTransaction } from '../../../utils/walletHelpers';
import { blockchainSelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function WalletTransactionHistory({ failure, transactionHistory }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();

  const transactionHistoryProcessor = (transactionHistoryInfo, index) => {
    const value = transactionHistoryInfo.fromId === walletAddress
      ? `-${transactionHistoryInfo.value}`
      : transactionHistoryInfo.value;
    const isStakingTransaction = 'userId' in transactionHistoryInfo;
    const isAmountPositive = isStakingTransaction ? transactionHistoryInfo?.isPositive
      : new BN(value).gt(BN_ZERO);
    const imgAlt = isAmountPositive ? 'reviceIcon' : 'paymentIcon';
    const dateTransactionHistory = formatDate(new Date(transactionHistoryInfo.block.timestamp), true);

    const fromToId = isAmountPositive ? transactionHistoryInfo.fromId : transactionHistoryInfo.toId;
    const userId = isStakingTransaction ? transactionHistoryInfo.userId : fromToId;

    const typeTextFromToId = isAmountPositive ? 'from' : 'to';
    const typeText = isStakingTransaction ? transactionHistoryInfo.stakingActionText : typeTextFromToId;
    const iconType = isAmountPositive ? reciveIcon : paymentIcon;
    const configFormat = {
      isSymbolFirst: true,
    };
    const assetLldLLm = transactionHistoryInfo.asset === 'LLM'
      ? formatMeritTransaction(value, configFormat)
      : formatDollarTransaction(value, configFormat);
    const asset = (transactionHistoryInfo.asset === 'LLM'
  || transactionHistoryInfo.asset === 'LLD') ? assetLldLLm
      : formatAssetTransaction(
        value,
        transactionHistoryInfo.asset,
        transactionHistoryInfo.decimals,
        {
          isSymbolFirst: true,
          isAsset: true,
        },
      );
    return {
      key: index,
      imgAlt,
      dateTransactionHistory,
      userId,
      typeText,
      iconType,
      asset,
      status: true, // TODO: Add failed transactions?
    };
  };

  return (
    <Table
      columns={[
        {
          title: 'Type',
          dataIndex: 'typeText',
          key: 'typeText',
          render: (value, record) => (
            <>
              <img src={record.iconType} alt={record.imgAlt} />
              {' '}
              {value}
            </>
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
            <Status
              status="success"
              completed
              declined={false}
            />
          ),
        },
      ]}
      dataSource={failure ? [] : transactionHistory.map(transactionHistoryProcessor)}
    />
  );
}

export default WalletTransactionHistory;
