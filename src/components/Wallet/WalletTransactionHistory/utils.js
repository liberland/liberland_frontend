import { BN, BN_ZERO } from '@polkadot/util';
import { formatMeritTransaction, formatDollarTransaction, formatAssetTransaction } from '../../../utils/walletHelpers';
import formatDate from '../../../utils/formatDate';
import paymentIcon from '../../../assets/icons/RedArrowCicrle.svg';
import reciveIcon from '../../../assets/icons/GreenArrowCircle.svg';

export const transactionHistoryProcessorFactory = (walletAddress) => (transactionHistoryInfo, index) => {
  const value = transactionHistoryInfo.fromId === walletAddress
    ? `-${transactionHistoryInfo.value}`
    : transactionHistoryInfo.value;
  const isStakingTransaction = 'userId' in transactionHistoryInfo;
  const isAmountPositive = isStakingTransaction
    ? transactionHistoryInfo?.isPositive
    : new BN(value).gt(BN_ZERO);
  const imgAlt = isAmountPositive ? 'reviceIcon' : 'paymentIcon';
  const dateTransactionHistory = formatDate(
    new Date(transactionHistoryInfo.block.timestamp),
    true,
  );

  const fromToId = isAmountPositive
    ? transactionHistoryInfo.fromId
    : transactionHistoryInfo.toId;
  const userId = isStakingTransaction
    ? transactionHistoryInfo.userId
    : fromToId;

  const typeTextFromToId = isAmountPositive ? 'from' : 'to';
  const typeText = isStakingTransaction
    ? transactionHistoryInfo.stakingActionText
    : typeTextFromToId;
  const iconType = isAmountPositive ? reciveIcon : paymentIcon;
  const configFormat = {
    isSymbolFirst: true,
  };
  const assetLldLLm = transactionHistoryInfo.asset === 'LLM'
    ? formatMeritTransaction(value, configFormat)
    : formatDollarTransaction(value, configFormat);
  const asset = transactionHistoryInfo.asset === 'LLM'
    || transactionHistoryInfo.asset === 'LLD'
    ? assetLldLLm
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
