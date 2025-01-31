import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import formatDate from '../../utils/formatDate';
import CurrencyIcon from '../CurrencyIcon';
import Table from '../Table';
import CopyIconWithAddress from '../CopyIconWithAddress';
import { identityActions, walletActions } from '../../redux/actions';
import { identitySelectors, walletSelectors } from '../../redux/selectors';
import { formatAssets } from '../../utils/walletHelpers';

export default function SpendingTable({ spending }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      spending.map(({ recipient }) => recipient).filter((recipient) => recipient !== '-'),
    ));
  }, [dispatch, spending]);

  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

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
  }) => {
    const assetSymbol = (() => {
      switch (asset) {
        case '-':
        case 'LLD':
        case 'LLM':
          return asset;
        default:
          return additionalAssets?.find(({
            index,
          }) => index === parseInt(asset))?.metadata?.symbol || asset;
      }
    })();
    const assetDecimals = (() => {
      switch (asset) {
        case '-':
        case 'LLD':
        case 'LLM':
          return 12;
        default:
          return additionalAssets?.find(({
            index,
          }) => index === parseInt(asset))?.metadata?.decimals || 12;
      }
    })();
    return {
      timestamp: formatDate(timestamp, ' '),
      recipient: recipient !== '-' && (
        <CopyIconWithAddress address={recipient} name={names?.[recipient]?.name} />
      ),
      asset: (
        <Flex wrap gap="7px" align="center">
          <div>
            {value !== '-' && formatAssets(value, assetDecimals)}
          </div>
          {assetSymbol !== '-' && (
            <>
              <div>
                {assetSymbol}
              </div>
              <CurrencyIcon size={20} symbol={assetSymbol} />
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
    };
  }), [additionalAssets, spending, names]);

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
