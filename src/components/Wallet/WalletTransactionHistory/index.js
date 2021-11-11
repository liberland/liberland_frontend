import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import Card from '../../Card';

import { walletSelectors } from '../../../redux/selectors';

import { ReactComponent as CheckIcon } from '../../../assets/icons/green-check.svg';
import { ReactComponent as RefundIcon } from '../../../assets/icons/refund.svg';
import { ReactComponent as FailedIcon } from '../../../assets/icons/failed.svg';
import styles from './styles.module.scss';
import Status from '../../Status';

const paymentTypeIcons = {
  failed: () => <FailedIcon />,
  success: () => <CheckIcon />,
  refund: () => <RefundIcon />,
};

const WalletTransactionHistory = () => {
  // const transactionHistory = [
  //   {
  //     status: 'completed',
  //     amount: 0.532,
  //     number: '#23432',
  //     date: 'Today, 11:54 AM',
  //     paymentType: 'complete',
  //   },
  //   {
  //     status: 'completed',
  //     amount: 0.532,
  //     number: '#23433',
  //     date: 'Today, 11:54 AM',
  //     paymentType: 'refund',
  //   },
  //   {
  //     status: 'declined',
  //     amount: -0.532,
  //     number: '#23434',
  //     date: 'Today, 11:54 AM',
  //     paymentType: 'failed',
  //   },
  // ];

  // id(pin):6
  // account_from(pin):"5FX5sQnbXXN9A1fM7PkSvwYU33NotLuNamM4Gjoht2vZZgBj"
  // account_to(pin):"5E4UzjgcNeCZCFTBbUhfTknM6qEGPKEmomCajQNLcYbzbq7x"
  // amount(pin):"100"
  // status(pin):"success"
  // createdAt(pin):"2021-11-10T13:51:48.742Z"
  // updatedAt(pin):"2021-11-10T13:51:48.742Z"

  const transactionHistory = useSelector(walletSelectors.selectorHistoryTx);

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
            <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.id}>
              <div className={styles.paymentNumber}>
                <div className={styles.paymentNumberIcon}>
                  {paymentTypeIcons.success()}
                </div>
                <div className={styles.paymentFrom}>
                  {
                    isAmountPositive
                      ? (
                        <p>
                          Payment from
                          {' '}
                          <span>
                            {transactionHistoryInfo.account_to}
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
                {isAmountPositive ? `+${transactionHistoryInfo.amount}` : transactionHistoryInfo.amount}
                {' '}
                LLM
              </div>
              <div>
                <Status
                  status={transactionHistoryInfo.status}
                  completed={transactionHistoryInfo.status === 'success'}
                  declined={transactionHistoryInfo.status === 'declined'}
                />
              </div>
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
