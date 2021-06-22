import React from 'react';
import Button from '../../Button/Button';
import Card from '../../Card';

import { ReactComponent as CheckIcon } from '../../../assets/icons/green-check.svg';
import { ReactComponent as RefundIcon } from '../../../assets/icons/refund.svg';
import { ReactComponent as FailedIcon } from '../../../assets/icons/failed.svg';
import styles from './styles.module.scss';
import Status from '../../Status';

const paymentTypeIcons = {
  failed: () => <FailedIcon />,
  complete: () => <CheckIcon />,
  refund: () => <RefundIcon />,
};

const WalletTransactionHistory = () => {
  const transactionHistory = [
    {
      status: 'completed',
      amount: 0.532,
      number: '#23432',
      date: 'Today, 11:54 AM',
      paymentType: 'complete',
    },
    {
      status: 'completed',
      amount: 0.532,
      number: '#23433',
      date: 'Today, 11:54 AM',
      paymentType: 'refund',
    },
    {
      status: 'declined',
      amount: -0.532,
      number: '#23434',
      date: 'Today, 11:54 AM',
      paymentType: 'failed',
    },
  ];

  return (
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
            <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.number}>
              <div className={styles.paymentNumber}>
                <div className={styles.paymentNumberIcon}>
                  {paymentTypeIcons[transactionHistoryInfo.paymentType]()}
                </div>
                <div className={styles.paymentFrom}>
                  <p>
                    Payment from
                    <span>
                      {' '}
                      {transactionHistoryInfo.number}
                    </span>
                  </p>
                  <p className={styles.paymentFromDate}>{transactionHistoryInfo.date}</p>
                </div>
              </div>
              <div className={styles.transactionHistoryAmount}>
                {isAmountPositive ? `+${transactionHistoryInfo.amount}` : transactionHistoryInfo.amount}
                {' '}
                LLM
              </div>
              <div><Status status={transactionHistoryInfo.status} /></div>
            </div>
          );
        })}

        <Button>
          View All Transactions &gt;
        </Button>
      </div>
    </Card>
  );
};

export default WalletTransactionHistory;
