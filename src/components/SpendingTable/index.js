import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import formatDate from '../../utils/formatDate';
import CurrencyIcon from '../CurrencyIcon';
import Table from '../Table';
import CopyIconWithAddress from '../CopyIconWithAddress';
import { identityActions } from '../../redux/actions';
import { identitySelectors } from '../../redux/selectors';
import { formatAssets } from '../../utils/walletHelpers';

export default function SpendingTable({ spending }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      spending.map(({ recipient }) => recipient).filter((recipient) => recipient !== '-'),
    ));
  }, [dispatch, spending]);

  const displayData = useMemo(() => spending.map(({
    timestamp,
    recipient,
    asset,
    value,
    category,
    project,
    supplier,
    description,
    finalDestination,
    amountInUsd,
    date,
    textRemark,
  }) => ({
    timestamp: formatDate(timestamp, ' '),
    recipient: recipient !== '-' && (
      <CopyIconWithAddress address={recipient} name={names?.[recipient]?.name} />
    ),
    asset: (
      <Flex wrap gap="10px" align="center">
        {value !== '-' && formatAssets(value, 12)}
        {asset !== '-' && (
          <>
            {asset}
            <CurrencyIcon size={20} symbol={asset} />
          </>
        )}
      </Flex>
    ),
    category,
    project,
    supplier,
    description,
    finalDestination,
    amountInUsd,
    date: date !== '-' ? formatDate(date, ' ') : '-',
    textRemark,
  })), [spending, names]);

  return (
    <Collapse
      defaultActiveKey={['table']}
      items={[
        {
          key: 'table',
          label: 'Spending table',
          children: (
            <Table
              columns={[
                {
                  Header: 'Timestamp',
                  accessor: 'timestamp',
                },
                {
                  Header: 'Recipient',
                  accessor: 'recipient',
                },
                {
                  Header: 'Amount',
                  accessor: 'asset',
                },
                {
                  Header: 'Category',
                  accessor: 'category',
                },
                {
                  Header: 'Supplier',
                  accessor: 'supplier',
                },
                {
                  Header: 'Description',
                  accessor: 'description',
                },
                {
                  Header: 'Final destination',
                  accessor: 'finalDestination',
                },
                {
                  Header: 'Amount in USD',
                  accessor: 'amountInUsd',
                },
                {
                  Header: 'Date',
                  accessor: 'date',
                },
                {
                  Header: 'Remark',
                  accessor: 'textRemark',
                },
              ]}
              data={displayData}
            />
          ),
        },
      ]}
    />
  );
}

SpendingTable.propTypes = {
  spending: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.instanceOf(Date).isRequired,
    recipient: PropTypes.string.isRequired,
    asset: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    supplier: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    finalDestination: PropTypes.string.isRequired,
    amountInUsd: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    currency: PropTypes.string.isRequired,
    textRemark: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};
