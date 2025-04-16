import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Descriptions from 'antd/es/descriptions';
import { useMediaQuery } from 'usehooks-ts';
import classNames from 'classnames';
import uniq from 'lodash/uniq';
import formatDate from '../../utils/formatDate';
import CurrencyIcon from '../CurrencyIcon';
import Table from '../Table';
import CopyIconWithAddress from '../CopyIconWithAddress';
import { identityActions, walletActions } from '../../redux/actions';
import { identitySelectors, walletSelectors } from '../../redux/selectors';
import { formatAssets } from '../../utils/walletHelpers';
import ColorAvatar from '../ColorAvatar';
import styles from './styles.module.scss';
import truncate from '../../utils/truncate';

export default function SpendingTable({
  spending,
  isLoading,
  total,
  onNext,
}) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      uniq(
        spending.map(({ recipient }) => recipient).filter((recipient) => recipient !== '-'),
      ),
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
    const { identity } = names?.[recipient] || {};
    const name = identity?.legal || identity?.name;
    return {
      timestamp: timestamp !== '-' ? formatDate(timestamp, ' ') : '-',
      recipient: recipient !== '-' && (
        <Flex wrap gap="10px" align="center">
          <ColorAvatar size={32} name={name || 'U'} />
          <Flex vertical gap="5px">
            <strong>
              {truncate(name || 'Unknown', 20)}
            </strong>
            <div className="description">
              <CopyIconWithAddress address={recipient} />
            </div>
          </Flex>
        </Flex>
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
    };
  }), [additionalAssets, spending, names]);

  return (
    <Collapse
      defaultActiveKey={['table']}
      collapsible="icon"
      items={[
        {
          key: 'table',
          label: 'Spending table',
          children: isBigScreen ? (
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
              ]}
              data={displayData}
              total={total}
              simple
              onPageChange={onNext}
              disablePagination={isLoading}
              pageSize={10}
            />
          ) : (
            <List
              dataSource={displayData}
              itemLayout="horizontal"
              size="small"
              pagination={{
                pageSize: 10,
                total,
                onChange: onNext,
                simple: { readOnly: true },
                showSizeChanger: false,
                disabled: isLoading,
              }}
              renderItem={({
                timestamp,
                recipient,
                asset,
                category,
                supplier,
                description,
                finalDestination,
                amountInUsd,
              }) => (
                <List.Item>
                  <Card className={styles.mobileCard}>
                    <Flex vertical gap="15px">
                      <Flex align="center" wrap justify="space-between" gap="15px">
                        {recipient}
                        <div className={classNames(styles.mobileStamp, 'description')}>
                          {timestamp}
                        </div>
                      </Flex>
                      {asset}
                      <Descriptions
                        title={(
                          <div className={classNames(styles.mobileDetails, 'description')}>
                            Details
                          </div>
                        )}
                        layout="vertical"
                        bordered
                        size="small"
                      >
                        <Descriptions.Item label="Category">
                          {category}
                        </Descriptions.Item>
                        <Descriptions.Item label="Supplier">
                          {supplier}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Final destination">
                          {finalDestination}
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount in USD">
                          {amountInUsd}
                        </Descriptions.Item>
                      </Descriptions>
                    </Flex>
                  </Card>
                </List.Item>
              )}
            />
          ),
        },
      ]}
    />
  );
}

SpendingTable.propTypes = {
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
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
    amountInUsd: PropTypes.number.isRequired,
  }).isRequired).isRequired,
};
