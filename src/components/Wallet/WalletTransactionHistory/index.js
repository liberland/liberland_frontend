/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import Card from '../../Card';

import { ReactComponent as CheckIcon } from '../../../assets/icons/green-check.svg';
import { ReactComponent as RefundIcon } from '../../../assets/icons/refund.svg';
import { ReactComponent as FailedIcon } from '../../../assets/icons/failed.svg';
import styles from './styles.module.scss';
import Status from '../../Status';
import { formatMeritTransaction, formatDollarTransaction } from '../../../utils/walletHelpers';

import { blockchainSelectors } from '../../../redux/selectors';

const dollarsQuery = gql`
    query Transfers($orderBy: [TransfersOrderBy!], $filter: TransferFilter) {
      query {
        transfers(orderBy: $orderBy, filter: $filter) {
          nodes {
            id
            fromId
            toId
            value
            extrinsicIndex
            eventIndex
            block {
              id
              number
              timestamp
            }
          }
        }
      }
    }
`;

const meritsQuery = gql`
    query Merits($orderBy: [MeritsOrderBy!], $filter: MeritFilter) {
      query {
        merits(orderBy: $orderBy, filter: $filter) {
          nodes {
            id
            fromId
            toId
            value
            extrinsicIndex
            eventIndex
            block {
              id
              number
              timestamp
            }
          }
        }
      }
    }
`;
const paymentTypeIcons = {
  failure: <FailedIcon />,
  success: <CheckIcon />,
  refund: <RefundIcon />,
};

function WalletTransactionHistory({ _transactionHistory, textForBtn, bottomButtonOnclick }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();
  const variables = {
    orderBy: ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'],
    filter: {
      or: [
        {
          fromId: {
            equalTo: walletAddress,
          },
        },
        {
          toId: {
            equalTo: walletAddress,
          },
        },
      ],
    },
  };

  const pollInterval = 1000;
  const lld = useQuery(dollarsQuery, { variables, pollInterval });
  const llm = useQuery(meritsQuery, { variables, pollInterval });

  const transactionHistory = llm.data && lld.data
    ? llm.data.query.merits.nodes.map((n) => ({ asset: 'LLM', ...n }))
      .concat(lld.data.query.transfers.nodes.map((n) => ({ asset: 'LLD', ...n })))
    : [];
  transactionHistory.sort((a, b) => a.block.number - b.block.number);

  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <div className={styles.transactionHistoryCard}>
        <div className={styles.transactionHistoryCardHeader}>
          <span>PAYMENT NUMBER</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>

        {transactionHistory.map((transactionHistoryInfo) => {
          const value = transactionHistoryInfo.fromId === walletAddress
            ? -transactionHistoryInfo.value
            : transactionHistoryInfo.value;
          const isAmountPositive = value > 0;
          return (
            <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.id}>
              <div className={styles.paymentNumber}>
                <div className={styles.paymentNumberIcon}>
                  {paymentTypeIcons.success}
                </div>
                <div className={styles.paymentFrom}>
                  {
                    isAmountPositive
                      ? (
                        <p>
                          Payment from
                          {' '}
                          <span>
                            {transactionHistoryInfo.fromId}
                          </span>
                        </p>
                      )
                      : (
                        <p>
                          Payment to
                          {' '}
                          <span>
                            {transactionHistoryInfo.toId}
                          </span>
                        </p>

                      )
                  }
                  <p className={styles.paymentFromDate}>{transactionHistoryInfo.block.timestamp}</p>
                </div>
              </div>
              <div className={styles.transactionHistoryAmount}>
                {transactionHistoryInfo.asset === 'LLM'
                  ? formatMeritTransaction(value)
                  : formatDollarTransaction(value)}
              </div>
              <div>
                <Status
                  status="success"
                  completed
                  declined={false}
                />
              </div>
            </div>
          );
        })}

        {/* <Button onClick={bottomButtonOnclick}>
        {textForBtn}
        {' '}
        &gt;
    </Button> */}
      </div>
    </Card>
  );
}
export default WalletTransactionHistory;
