import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Select from 'antd/es/select';
import Collapse from 'antd/es/collapse';
import Result from 'antd/es/result';
import Spin from 'antd/es/spin';
import Title from 'antd/es/typography/Title';
import { identityActions, officesActions } from '../../../redux/actions';
import { officesSelectors } from '../../../redux/selectors';
import TaxPayerCard from './TaxPayerCard';

export default function TaxPayers() {
  const [timePeriodInMonth, setTimePeriodInMonth] = useState(3);
  const dispatch = useDispatch();
  const taxPayers = useSelector(officesSelectors.selectorTaxesPayers);
  const { sortedPoolTotals, sortedUnpoolTotals, sortedTotalsByAddressPoolTotal } = taxPayers;

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
          children: topPoolTotals ? (
            <Row gutter={[16, 16]}>
              {topPoolTotals.length ? (
                topPoolTotals.map(({ addressId, totalValue }, index) => (
                  <Col xs={24} sm={12} xl={8} key={addressId}>
                    <TaxPayerCard
                      address={addressId}
                      index={index}
                      totalValue={totalValue}
                    />
                  </Col>
                ))
              ) : (
                <Result status="404" title="No Pool Totals Available" />
              )}
            </Row>
          ) : <Spin />,
        },
        {
          key: 'worstRecent',
          label: 'Wall of shame',
          extra: `Last ${timePeriodInMonth} months`,
          children: topUnpoolTotals ? (
            <Row gutter={[16, 16]}>
              {topUnpoolTotals.length ? (
                topUnpoolTotals.map(({ addressId, totalValue }, index) => (
                  <Col xs={24} sm={12} xl={8} key={addressId}>
                    <TaxPayerCard
                      address={addressId}
                      index={index}
                      totalValue={totalValue}
                    />
                  </Col>
                ))
              ) : (
                <Result status="404" title="No Unpool Totals Available" />
              )}
            </Row>
          ) : <Spin />,
        },
        {
          key: 'best',
          label: 'Best ever taxpayers',
          children: sortedTotalsByAddressPoolTotal ? (
            <Row gutter={[16, 16]}>
              {sortedTotalsByAddressPoolTotal.length ? (
                sortedTotalsByAddressPoolTotal.map(({ addressId, totalValue }, index) => (
                  <Col xs={24} sm={12} xl={8} key={addressId}>
                    <TaxPayerCard
                      address={addressId}
                      index={index}
                      totalValue={totalValue}
                    />
                  </Col>
                ))
              ) : (
                <Result status="404" title="No Best Ever Totals Available" />
              )}
            </Row>
          ) : <Spin />,
        },
      ]}
    />
  );
}
