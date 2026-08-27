import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Select from 'antd/es/select';
import Collapse from 'antd/es/collapse';
import Result from 'antd/es/result';
import Spin from 'antd/es/spin';
import { identityActions, officesActions } from '../../../redux/actions';
import { officesSelectors } from '../../../redux/selectors';
import TaxPayerCard from './TaxPayerCard';

export default function TaxPayers() {
  const [timePeriodInMonth, setTimePeriodInMonth] = useState(3);
  const dispatch = useDispatch();
  const taxPayers = useSelector(officesSelectors.selectorTaxesPayers);
  const isLoading = useSelector(officesSelectors.selectorIsLoading);
  const { sortedPoolTotals, sortedUnpoolTotals, sortedTotalsByAddressPoolTotal } = taxPayers;

  const topUnpoolTotals = sortedUnpoolTotals?.slice(0, 10);

  // Being on the Wall of shame disqualifies you from every contributor
  // ranking: a net welfare recipient is not celebrated as a top contributor,
  // in the current window or all-time. Exclusion is applied before the top-10
  // slice so the fame list still fills to ten entries.
  const shamedAddresses = new Set((topUnpoolTotals || []).map(({ addressId }) => addressId));
  const notShamed = ({ addressId }) => !shamedAddresses.has(addressId);
  const topPoolTotals = sortedPoolTotals
    ? sortedPoolTotals.filter(notShamed).slice(0, 10)
    : undefined;
  const bestEverTotals = sortedTotalsByAddressPoolTotal
    ? sortedTotalsByAddressPoolTotal.filter(notShamed)
    : undefined;

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

  // The request failing leaves these lists undefined, so rendering a spinner
  // whenever they are missing span forever with no explanation. Only spin while
  // a request is genuinely in flight; once it has settled, say there is no data.
  const renderRanking = (items, label, emptyTitle) => {
    if (!items) {
      return isLoading ? <Spin /> : <Result status="info" title={emptyTitle} />;
    }
    if (!items.length) {
      return <Result status="info" title={emptyTitle} />;
    }
    return (
      <Row gutter={[16, 16]}>
        {items.map(({ addressId, totalValue }, index) => (
          <Col xs={24} sm={12} xl={8} key={addressId}>
            <TaxPayerCard
              address={addressId}
              index={index}
              totalValue={totalValue}
              label={label}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Collapse
      activeKey={['bestRecent', 'worstRecent', 'best']}
      items={[
        {
          key: 'bestRecent',
          label: 'Wall of fame',
          extra: (
            <Select
              defaultValue={timePeriodInMonth}
              style={{ width: 140 }}
              onChange={handleSelectChange}
              onClick={(e) => e.stopPropagation()}
            >
              <Select.Option value={3}>3 Months</Select.Option>
              <Select.Option value={12}>12 Months</Select.Option>
            </Select>
          ),
          children: renderRanking(topPoolTotals, 'Top Tax Payer', 'No tax payer data available'),
        },
        {
          key: 'worstRecent',
          label: 'Wall of shame',
          extra: `Last ${timePeriodInMonth} months`,
          children: renderRanking(topUnpoolTotals, 'Top Tax Receiver', 'No welfare recipient data available'),
        },
        {
          key: 'best',
          label: 'Best ever taxpayers',
          children: renderRanking(
            bestEverTotals,
            'Top Tax Payer',
            'No all-time tax payer data available',
          ),
        },
      ]}
    />
  );
}
