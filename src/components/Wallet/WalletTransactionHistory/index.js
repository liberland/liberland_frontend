/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import { useMediaQuery } from 'usehooks-ts';
import cx from 'classnames';
import Card from '../../Card';
import formatDate from '../../../utils/formatDate';
import paymentIcon from '../../../assets/icons/RedArrowCicrle.svg';
import reciveIcon from '../../../assets/icons/GreenArrowCircle.svg';

import styles from './styles.module.scss';
import Status from '../../Status';
import { formatMeritTransaction, formatDollarTransaction } from '../../../utils/walletHelpers';

import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy.svg';
import NotificationPortal from '../../NotificationPortal';

function WalletTransactionHistory({ failure, transactionHistory }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();
  const notificationRef = useRef();
  const isLarge = useMediaQuery('(min-width: 62em)');
  const isTabletHigher = useMediaQuery('(min-width: 1025px)');
  const isBigScreen = useMediaQuery('(min-width: 1520px)');

  const handleCopyClick = (address) => {
    navigator.clipboard.writeText(address);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  transactionHistory.sort((a, b) => new BN(b.block.number).sub(new BN(a.block.number)));

  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.transactionHistoryCard}>
        <div className={cx(styles.transactionHistoryCardHeaderMobile, styles.transactionHistoryCardHeader)}>
          <span>ADRESS / TIME</span>
          <span>AMOUNT / STATUS</span>
        </div>
        <div className={cx(
          styles.transactionHistoryCardHeaderDesktop,
          styles.transactionHistoryCardHeader,
          styles.gridList,
        )}
        >
          <span>TYPE</span>
          <span>PAYMENT NUMBER</span>
          <span>DATE & TIME</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>
        {
          failure ? 'Failed to fetch transaction history'
            : transactionHistory.map((transactionHistoryInfo) => {
              const value = transactionHistoryInfo.fromId === walletAddress
                ? `-${transactionHistoryInfo.value}`
                : transactionHistoryInfo.value;
              const isAmountPositive = new BN(value).gt(BN_ZERO);
              const imgAlt = isAmountPositive ? 'reviceIcon' : 'paymentIcon';

              const dateTransacionHistory = formatDate(new Date(transactionHistoryInfo.block.timestamp), true);
              const userId = isAmountPositive ? transactionHistoryInfo.fromId : transactionHistoryInfo.toId;
              const typeTekst = isAmountPositive ? 'from' : 'to';
              const iconType = isAmountPositive ? reciveIcon : paymentIcon;
              return (
                <div className={cx(styles.transactionHistoryCardMain, styles.gridList)} key={transactionHistoryInfo.id}>
                  {isTabletHigher
                    ? (
                      <TransacionHistoryDesktop
                        handleCopyClick={handleCopyClick}
                        transactionHistoryInfo={transactionHistoryInfo}
                        value={value}
                        isBigScreen={isBigScreen}
                        dateTransacionHistory={dateTransacionHistory}
                        userId={userId}
                        imgAlt={imgAlt}
                        typeTekst={typeTekst}
                        iconType={iconType}
                      />
                    )
                    : (
                      <TransacionHistoryMobile
                        handleCopyClick={handleCopyClick}
                        transactionHistoryInfo={transactionHistoryInfo}
                        value={value}
                        isLarge={isLarge}
                        dateTransacionHistory={dateTransacionHistory}
                        userId={userId}
                        imgAlt={imgAlt}
                        typeTekst={typeTekst}
                        iconType={iconType}
                      />
                    )}
                </div>
              );
            })
        }
      </div>
    </Card>
  );
}

function TransacionHistoryDesktop({
  iconType,
  imgAlt,
  typeTekst,
  userId,
  handleCopyClick,
  isBigScreen,
  transactionHistoryInfo,
  dateTransacionHistory,
  value,
}) {
  return (
    <>
      <div className={styles.paymentNumber}>
        <div className={styles.paymentNumberIcon}>
          <img src={iconType} alt={imgAlt} />
          <span className={styles.desktopTekst}>
            {typeTekst}
          </span>
        </div>
      </div>
      <p className={styles.bold}>
        <span>
          <CopyIcon
            className={styles.copyIcon}
            name="walletAddress"
            onClick={() => handleCopyClick(userId)}
          />
          {isBigScreen ? userId : truncate(userId, 13)}
        </span>
      </p>
      <p className={styles.paymentFromDate}>{dateTransacionHistory}</p>
      <span className={styles.bold}>
        {transactionHistoryInfo.asset === 'LLM'
          ? formatMeritTransaction(value, true)
          : formatDollarTransaction(value, true)}
      </span>
      <div className={styles.status}>
        <Status
          status="success"
          completed
          declined={false}
        />
      </div>

    </>
  );
}

function TransacionHistoryMobile({
  typeTekst,
  handleCopyClick,
  transactionHistoryInfo,
  value,
  isLarge,
  dateTransacionHistory,
  userId,
  imgAlt,
  iconType,
}) {
  return (
    <>
      <div className={styles.paymentNumber}>
        <div className={styles.paymentNumberIcon}>
          <img src={iconType} alt={imgAlt} />
        </div>
        <div className={styles.paymentFrom}>
          <p>
            {typeTekst}
            {' '}
            <span>
              <CopyIcon
                className={styles.copyIcon}
                name="walletAddress"
                onClick={() => handleCopyClick(userId)}
              />
              {isLarge ? userId : truncate(userId, 13)}
            </span>
          </p>

          <p className={styles.paymentFromDate}>{dateTransacionHistory}</p>
        </div>
      </div>
      <div className={styles.transactionHistoryAmount}>
        <span>
          {transactionHistoryInfo.asset === 'LLM'
            ? formatMeritTransaction(value, true)
            : formatDollarTransaction(value, true)}
        </span>
        <Status
          status="success"
          completed
          declined={false}
        />
      </div>
    </>

  );
}

export default WalletTransactionHistory;
