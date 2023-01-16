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
import { formatMeritTransaction } from '../../../utils/walletHelpers';

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

/* const WalletTransactionHistory = ({ transactionHistory, textForBtn, bottomButtonOnclick }) => (
  <Card title="Transaction History" className={styles.cardWrapper}>
    <div className={styles.transactionHistoryCard}>
      <div className={styles.transactionHistoryCardHeader}>
        <span>PAYMENT NUMBER</span>
        <span>AMOUNT</span>
        <span>STATUS</span>
      </div>

      {transactionHistory.map((transactionHistoryInfo) => {
        const isAmountPositive = transactionHistoryInfo.amount > 0;
        return (
          <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.id}>
            <div className={styles.paymentNumber}>
              <div className={styles.paymentNumberIcon}>
                {paymentTypeIcons[transactionHistoryInfo.status]}
              </div>
              <div className={styles.paymentFrom}>
                {
                    isAmountPositive
                      ? (
                        <p>
                          Payment from
                          {' '}
                          <span>
                            {transactionHistoryInfo.account_from}
                          </span>
                        </p>
                      )
                      : (
                        <p>
                          Payment to
                          {' '}
                          <span>
                            {transactionHistoryInfo.account_to}
                          </span>
                        </p>

                      )
                  }
                <p className={styles.paymentFromDate}>{transactionHistoryInfo.date}</p>
              </div>
            </div>
            <div className={styles.transactionHistoryAmount}>
              {formatMeritTransaction(transactionHistoryInfo.amount)}
            </div>
            <div>
              <Status
                status={transactionHistoryInfo.status}
                completed={transactionHistoryInfo.status === 'success'}
                declined={transactionHistoryInfo.status === 'failure'}
              />
            </div>
          </div>
        );
      })}

      <Button onClick={bottomButtonOnclick}>
        {textForBtn}
        {' '}
        &gt;
      </Button>
    </div>
  </Card>
); */

function WalletTransactionHistory({ transactionHistory, textForBtn, bottomButtonOnclick }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();
  const variables = {
    orderBy: ['BLOCK_NUMBER_DESC', 'EVENT_INDEX_DESC'],
    filter: {
      or: [
        {
          fromId: {
            equalTo: walletAddress.toLowerCase(),
          },
        },
        {
          toId: {
            equalTo: walletAddress.toLowerCase(),
          },
        },
      ],
    },
  };

  const pollInterval = 1000;
  const lld = useQuery(dollarsQuery, { variables, pollInterval });
  const llm = useQuery(meritsQuery, { variables, pollInterval });
  if (llm.data) console.log('LLM Transfers: ', llm.data.query.merits.nodes);
  if (lld.data) console.log('LLD ransfers: ', lld.data.query.transfers.nodes);

  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <div className={styles.transactionHistoryCard}>
        Refactor in progress
      </div>
    </Card>
  );
}
export default WalletTransactionHistory;
