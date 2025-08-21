import React from 'react';
import Flex from 'antd/es/flex';
import CurrencyIcon from '../../CurrencyIcon';
import { formatDollars, parseDollars } from '../../../utils/walletHelpers';
import CopyIconWithAddress from '../../CopyIconWithAddress';

export const enhanceTopHolders = (holders) => holders.map((holder, index) => ({
  ...holder,
  address: <CopyIconWithAddress address={holder.address} isTruncate />,
  display: holder.display || 'Unknown',
  total_lld_balance: (
    <Flex align="center" gap="10px">
      {formatDollars(parseDollars(holder.total_lld_balance))}
      <CurrencyIcon size={24} symbol="LLD" />
    </Flex>
  ),
  frozen_lld_balance: (
    <Flex align="center" gap="10px">
      {formatDollars(parseDollars(holder.frozen_lld_balance))}
      <CurrencyIcon size={24} symbol="LLD" />
    </Flex>
  ),
  index: index + 1,
}));
