import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Typography, Row, Col, Space, Select,
} from 'antd';
import { identityActions, officesActions } from '../../../redux/actions';
import { officesSelectors } from '../../../redux/selectors';
import { formatMerits } from '../../../utils/walletHelpers';
import HistoryCopyIconWithAddress from '../../Wallet/HistoryCopyIconWithAddress';

const { Title, Text } = Typography;
const { Option } = Select;

const getRankSuffix = (rank) => {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
};

export default function TaxPayers() {
  const [timePeriodInMonth, setTimePeriodInMonth] = useState(12);
  const dispatch = useDispatch();
  const taxesPayers = useSelector(officesSelectors.selectorTaxesPayers);
  const { sortedPoolTotals, sortedUnpoolTotals, sortedTotalsByAddressPoolTotal } = taxesPayers;

  const topPoolTotals = sortedPoolTotals?.slice(0, 10);
  const topUnpoolTotals = sortedUnpoolTotals?.slice(0, 10);

  useEffect(() => {
    dispatch(officesActions.getTaxPayers.call(timePeriodInMonth));
  }, [dispatch, timePeriodInMonth]);

  useEffect(() => {
    const poolList = sortedPoolTotals
      ? sortedPoolTotals.map((item) => item.addressId)
      : [];
    const unPoolList = sortedUnpoolTotals
      ? sortedUnpoolTotals.map((item) => item.addressId)
      : [];
    const topTaxpayersList = sortedTotalsByAddressPoolTotal
      ? sortedTotalsByAddressPoolTotal.map((item) => item.addressId)
      : [];
    dispatch(
      identityActions.getIdentityMotions.call(
        Array.from(new Set(poolList.concat(unPoolList.flat()).concat(topTaxpayersList.flat()))),
      ),
    );
  }, [dispatch, sortedPoolTotals, sortedUnpoolTotals, sortedTotalsByAddressPoolTotal]);

  const handleSelectChange = (value) => {
    setTimePeriodInMonth(value);
  };

  return (
    <div>
      <Title level={4}>
        Best ever taxpayers
      </Title>
      <Row gutter={[16, 16]}>
        {sortedTotalsByAddressPoolTotal && sortedTotalsByAddressPoolTotal.length ? (
          sortedTotalsByAddressPoolTotal.map(({ addressId, totalValue }, index) => (
            <Col xs={24} sm={12} xl={8} key={addressId}>
              <Card hoverable>
                <Text type="secondary">
                  {`${index + 1}${getRankSuffix(index + 1)} Top Tax Payer`}
                </Text>
                <br />
                <HistoryCopyIconWithAddress address={addressId} />
                <br />
                <Space direction="vertical">
                  <Text>
                    <b>Total Value:</b>
                    {' '}
                    {`${formatMerits(totalValue)} LLM`}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Text>No Best Ever Totals Available</Text>
        )}
      </Row>

      <br />
      <br />

      <Text>
        Period:
        {'  '}
        <Select
          defaultValue={timePeriodInMonth}
          style={{ width: 140 }}
          onChange={handleSelectChange}
        >
          <Option value={12}>12 Months</Option>
          <Option value={3}>3 Months</Option>
        </Select>
      </Text>

      <Title level={4}>
        Wall of fame
        {' '}
        {timePeriodInMonth}
        {' '}
        month
        {' '}
      </Title>
      <Row gutter={[16, 16]}>
        {topPoolTotals && topPoolTotals.length ? (
          topPoolTotals.map(({ addressId, totalValue }, index) => (
            <Col xs={24} sm={12} xl={8} key={addressId}>
              <Card hoverable>
                <Text type="secondary">
                  {`${index + 1}${getRankSuffix(index + 1)} Top Tax Payer`}
                </Text>
                <br />
                <HistoryCopyIconWithAddress address={addressId} />
                <br />
                <Space direction="vertical">
                  <Text>
                    <b>Total Value:</b>
                    {' '}
                    {`${formatMerits(totalValue)} LLM`}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Text>No Pool Totals Available</Text>
        )}
      </Row>

      <Title level={4}>
        Wall of shame
        {' '}
        {timePeriodInMonth}
        {' '}
        month
        {' '}
      </Title>
      <Row gutter={[16, 16]}>
        {topUnpoolTotals && topUnpoolTotals.length ? (
          topUnpoolTotals.map(({ addressId, totalValue }, index) => (
            <Col xs={24} sm={12} xl={8} key={addressId}>
              <Card hoverable>
                <Text type="secondary">
                  {`${index + 1}${getRankSuffix(index + 1)} Top Tax Payout`}
                </Text>
                <br />
                <HistoryCopyIconWithAddress address={addressId} />
                <br />
                <Space direction="vertical">
                  <Text>
                    <b>Total Value:</b>
                    {' '}
                    {`${formatMerits(totalValue)} LLM`}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Text>No Unpool Totals Available</Text>
        )}
      </Row>
    </div>
  );
}
